import { redirect } from 'next/navigation';
import { createServerClient } from '../../../lib/supabaseClient';
import CreateSummaryForm from './CreateSummaryForm';
import { FormState } from './types';

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
