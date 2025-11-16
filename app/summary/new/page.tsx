import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { createServerClient } from '../../../lib/supabaseClient';

interface FormState {
  error?: string;
}

async function createSummaryAction(prevState: FormState, formData: FormData): Promise<FormState> {
  'use server';

  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const roleTitle = (formData.get('roleTitle') as string | null)?.trim();
  const candidateName = (formData.get('candidateName') as string | null)?.trim();
  const candidateTitle = (formData.get('candidateTitle') as string | null)?.trim();
  const hmNotes = (formData.get('hmNotes') as string | null)?.trim();
  const candidateNotes = (formData.get('candidateNotes') as string | null)?.trim();
  const resumeFile = formData.get('resume') as File | null;

  if (!roleTitle || !hmNotes) {
    return { error: 'Role title and hiring manager notes are required.' };
  }

  try {
    const publicViewId = crypto.randomUUID();
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .insert({
        created_by: session.user.id,
        candidate_name: candidateName || null,
        candidate_title: candidateTitle || null,
        role_title: roleTitle,
        status: 'processing',
        public_view_id: publicViewId,
      })
      .select()
      .single();

    if (summaryError || !summary) {
      console.error(summaryError);
      return { error: 'Unable to create summary record.' };
    }

    let resumePath: string | null = null;
    if (resumeFile && resumeFile.size > 0) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const storagePath = `${session.user.id}/${summary.id}/${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(storagePath, Buffer.from(arrayBuffer), {
          contentType: resumeFile.type || 'application/octet-stream',
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        return { error: 'Failed to upload resume.' };
      }

      resumePath = storagePath;
    }

    const { error: inputError } = await supabase.from('summary_inputs').insert({
      summary_id: summary.id,
      hm_notes: hmNotes,
      candidate_notes: candidateNotes || null,
      resume_url: resumePath,
    });

    if (inputError) {
      console.error(inputError);
      return { error: 'Failed to save inputs.' };
    }

    redirect(`/summary/${summary.id}/processing`);
  } catch (error) {
    console.error(error);
    return { error: 'Unexpected error creating summary.' };
  }

  return {};
}

function CreateSummaryForm({ action }: { action: any }) {
  'use client';
  const [state, formAction] = useFormState<FormState>(action, {});

  return (
    <div className="container py-10">
      <div className="bg-white shadow rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Create a new summary</h1>
        <form action={formAction} className="space-y-4" encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="candidateName">
                Candidate name (optional)
              </label>
              <input id="candidateName" name="candidateName" placeholder="Alex Candidate" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="candidateTitle">
                Candidate title (optional)
              </label>
              <input id="candidateTitle" name="candidateTitle" placeholder="Head of Product" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="roleTitle">
              Role title
            </label>
            <input id="roleTitle" name="roleTitle" placeholder="Director of Data" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="hmNotes">
              Hiring Manager notes
            </label>
            <textarea id="hmNotes" name="hmNotes" required className="h-28" placeholder="Top priorities, must-haves" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="candidateNotes">
              Candidate notes (optional)
            </label>
            <textarea id="candidateNotes" name="candidateNotes" className="h-24" placeholder="What the candidate shared" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="resume">
              Resume file (optional)
            </label>
            <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx,.txt" className="p-0" />
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button type="submit" className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary">
            Create summary
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function NewSummaryPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return <CreateSummaryForm action={createSummaryAction} />;
}
