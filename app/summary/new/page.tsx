"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Create a browser Supabase client using your public env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NewSummaryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You must be logged in to create a summary.");

      // Insert a new summary row (adjust table/column names if needed)
      const { data, error: insertError } = await supabase
        .from("summaries")
        .insert({
          user_id: user.id,
          title: title || "Untitled summary",
          raw_notes: notes ?? "",
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Go to the summary page
      router.push(`/summary/${data.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Create a new summary</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Candidate – VP of Data Strategy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Call notes / transcript
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border px-3 py-2 min-h-[160px]"
            placeholder="Paste your call notes here..."
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create summary"}
        </button>
      </form>
    </main>
  );
}
