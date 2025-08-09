import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(prompt: string) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return chatCompletion.choices[0].message.content || '';
  } catch (err: any) {
    console.error('OpenAI error:', err.message);
    return '⚠️ Unable to generate content due to API quota limits.';
  }
}
