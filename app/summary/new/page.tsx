"use client";

import { useState, FormEvent } from "react";

export default function NewSummaryPage() {
  const [status, setStatus] = useState<null | "saving" | string>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("saving");

    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;

    // Call your existing API route to create the summary
    const res = await fetch("/api/summaries/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (data.error) {
      setStatus(data.error || "Something went wrong.");
      return;
    }

    window.location.href = `/summary/${data.id}`;
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Summary</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          name="content"
          className="border p-3 rounded"
          placeholder="Paste your transcript or notes here..."
          required
        />

        {status && status !== "saving" && (
          <p className="text-red-600">{status}</p>
        )}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          {status === "saving" ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
