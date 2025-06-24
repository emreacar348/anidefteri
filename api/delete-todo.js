import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).end();
  try {
    const { id } = request.body;
    if (!id) return response.status(400).json({ error: 'ID is required' });
    await sql`DELETE FROM todos WHERE id = ${id};`;
    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}