import { createServerClient } from './supabaseClient';
import { getOpenAIClient } from './openaiClient';

export type GeneratedSummary = {
  header: {
    name: string;
    title: string;
    location: string;
    industry_fit: string;
  };
  what_you_shared_table: Array<{
    hm_priority: string;
    hm_quote: string;
    hm_timestamp: string;
    candidate_evidence: string;
    candidate_timestamp: string;
  }>;
  evidence_summary: string;
  considerations: string;
  outcomes: Array<{
    metric: string;
    org_type: string;
    description: string;
  }>;
  leadership_framing: string;
  resume_note: string;
};

export async function processSummary(summaryId: string): Promise<void> {
  const supabase = createServerClient();

  try {
    const { data: summary, error: summaryError } = await supabase
      .from('summaries')
      .select('id, candidate_name, candidate_title, role_title, status')
      .eq('id', summaryId)
      .single();

    if (summaryError || !summary) {
      throw summaryError || new Error('Summary not found');
    }

    const { data: inputs, error: inputsError } = await supabase
      .from('summary_inputs')
      .select('hm_notes, candidate_notes, resume_url')
      .eq('summary_id', summaryId)
      .single();

    if (inputsError || !inputs) {
      throw inputsError || new Error('Summary inputs missing');
    }

    const systemPrompt =
      'You are Aligned, an assistant that turns messy recruiter + hiring manager notes into a structured, neutral, evidence-first candidate summary. You never say that you selected or recommend the candidate; you only organize evidence against the hiring manager\'s priorities.';

    const resumeNote = inputs.resume_url
      ? 'A resume file was provided. Resume text extraction is not yet implemented, so rely on the notes provided.'
      : 'No resume file was provided.';

    const userPrompt = `Role title: ${summary.role_title}\nCandidate: ${summary.candidate_name || 'Unknown'}${
      summary.candidate_title ? ` (${summary.candidate_title})` : ''
    }\nHiring manager notes:\n${inputs.hm_notes}\nCandidate notes:\n${inputs.candidate_notes || 'None provided'}\nResume details: ${resumeNote}`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    const parsed = JSON.parse(content) as GeneratedSummary;

    const { error: upsertError } = await supabase.from('summary_outputs').upsert({
      summary_id: summaryId,
      header: parsed.header,
      what_you_shared_table: parsed.what_you_shared_table,
      evidence_summary: parsed.evidence_summary,
      considerations: parsed.considerations,
      outcomes: parsed.outcomes,
      leadership_framing: parsed.leadership_framing,
      resume_note: parsed.resume_note,
    });

    if (upsertError) {
      throw upsertError;
    }

    const { error: updateError } = await supabase
      .from('summaries')
      .update({ status: 'completed' })
      .eq('id', summaryId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('processSummary error', error);
    await supabase.from('summaries').update({ status: 'error' }).eq('id', summaryId);
  }
}
