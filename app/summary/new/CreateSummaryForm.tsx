'use client';

import { useFormState } from 'react-dom';
import { FormState } from './types';

interface CreateSummaryFormProps {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}

export default function CreateSummaryForm({ action }: CreateSummaryFormProps) {
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
