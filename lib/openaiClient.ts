import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  // eslint-disable-next-line no-console
  console.warn('OPENAI_API_KEY is not set. Summary processing will fail until it is configured.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
