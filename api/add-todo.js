import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).end();
  try {
    const { text } = request.body;
    if (!text) return response.status(400).json({ error: 'Text is required' });
    await sql`INSERT INTO todos (text) VALUES (${text});`;
    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}