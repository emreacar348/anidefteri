import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const { rows } = await sql`SELECT id, url, alt_text, blob_url FROM gallery_images ORDER BY created_at DESC;`;
    return response.status(200).json(rows);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}