import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { candidateName, recruiterNotes, jdBullets } = req.body;

  try {
    const prompt = `You are helping a recruiter write a candidate summary using their notes and the job description bullets.

Candidate Name: ${candidateName}

Recruiter Notes: ${recruiterNotes}

Job Description Bullets:
${jdBullets.map((b: string, i: number) => `${i + 1}. ${b}`).join('\n')}

Create a structured summary with the following sections:
- 🎧 JD Trust Table
- ✅ Fast Facts
- 🧩 JD Scorecard
- 📥 Recommendation
- 🧾 Candidate Summary`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    const aiOutput = completion.choices[0].message?.content;
    res.status(200).json({ report: aiOutput });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong generating the report.' });
  }
}
