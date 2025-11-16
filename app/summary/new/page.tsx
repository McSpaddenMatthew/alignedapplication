"use client";

import { useState } from "react";

export default function NewSummaryPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("saving");

    const content = formData.get("content");

    const res = await fetch("/api/summaries/create", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.error) {
      setStatus(data.error);
    } else {
      window.location.href = `/summary/${data.id}`;
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Summary</h1>

      <form action={handleSubmit} className="flex flex-col gap-4">
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
