import { openai } from './openaiClient';
import { createServerClient } from './supabaseClient';

export type GeneratedSummary = {
  header: {
    name: string;
    title: string;
    location?: string;
    industry_fit?: string;
  };
  what_you_shared_table: Array<{
    hm_priority: string;
    hm_quote?: string;
    hm_timestamp?: string;
    candidate_evidence?: string;
    candidate_timestamp?: string;
  }>;
  evidence_summary: string;
  considerations: string;
  outcomes: Array<{
    metric: string;
    org_type?: string;
    description?: string;
  }>;
  leadership_framing: string;
  resume_note: string;
};

export async function processSummary(summaryId: string): Promise<GeneratedSummary> {
  if (!summaryId) {
    throw new Error('summaryId is required');
  }

  const supabase = createServerClient();

  try {
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .select('*')
      .eq('id', summaryId)
      .single();

    if (summaryError || !summary) {
      throw new Error(`Summary ${summaryId} not found`);
    }

    const { data: summaryInputs, error: inputsError } = await supabase
      .from('summary_inputs')
      .select('*')
      .eq('summary_id', summaryId)
      .single();

    if (inputsError || !summaryInputs) {
      throw new Error(`Summary inputs for ${summaryId} not found`);
    }

    const messages = [
      {
        role: 'system' as const,
        content:
          'You are Aligned, an assistant that turns messy recruiter + hiring manager notes into a structured, neutral, evidence-first candidate summary. You never claim to select or endorse candidates; you only organize evidence.',
      },
      {
        role: 'user' as const,
        content: `Generate a JSON summary for Aligned with the following structure and tone:\n\nSummary Schema:\n{\n  "header": {\n    "name": "...",\n    "title": "...",\n    "location": "...",\n    "industry_fit": "..."\n  },\n  "what_you_shared_table": [\n    {\n      "hm_priority": "...",\n      "hm_quote": "...",\n      "hm_timestamp": "...",\n      "candidate_evidence": "...",\n      "candidate_timestamp": "..."\n    }\n  ],\n  "evidence_summary": "...",\n  "considerations": "...",\n  "outcomes": [\n    {\n      "metric": "...",\n      "org_type": "...",\n      "description": "..."\n    }\n  ],\n  "leadership_framing": "...",\n  "resume_note": "..."\n}\n\nTone + structure: neutral, evidence-first, never endorse or select candidates.\n\nRole Title: ${summary.role_title || 'Not provided'}\nCandidate Name: ${summary.candidate_name || 'Not provided'}\nCandidate Title: ${summary.candidate_title || 'Not provided'}\n\nHiring Manager Notes:\n${summaryInputs.hm_notes || 'None provided'}\n\nCandidate Notes:\n${summaryInputs.candidate_notes || 'None provided'}\n\nResume URL (if provided): ${summaryInputs.resume_url || 'None provided'}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      response_format: { type: 'json_object' },
      messages,
    });

    const content = completion.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsed = JSON.parse(content) as GeneratedSummary;

    const { error: upsertError } = await supabase.from('summary_outputs').upsert(
      [
        {
          summary_id: summaryId,
          header: parsed.header,
          what_you_shared_table: parsed.what_you_shared_table ?? [],
          evidence_summary: parsed.evidence_summary,
          considerations: parsed.considerations,
          outcomes: parsed.outcomes ?? [],
          leadership_framing: parsed.leadership_framing,
          resume_note: parsed.resume_note,
        },
      ],
      { onConflict: 'summary_id' }
    );

    if (upsertError) {
      throw upsertError;
    }

    const { error: statusError } = await supabase
      .from('summaries')
      .update({ status: 'completed' })
      .eq('id', summaryId);

    if (statusError) {
      throw statusError;
    }

    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing summary', error);
    await supabase
      .from('summaries')
      .update({ status: 'error' })
      .eq('id', summaryId);
    throw error;
  }
}

/**
 * Example usage from a server action (e.g., after creating a summary):
 *
 * 'use server';
 * import { processSummary } from '@/lib/processSummary';
 *
 * export async function startProcessing(summaryId: string) {
 *   await processSummary(summaryId);
 * }
 *
 * Example usage from a route handler (e.g., /summary/[id]/processing trigger):
 *
 * export async function POST(request: Request, { params }: { params: { id: string } }) {
 *   await processSummary(params.id);
 *   return new Response(null, { status: 202 });
 * }
 */
