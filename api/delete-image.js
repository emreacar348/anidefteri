import { del } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).end();
  
  try {
    const { id, blobUrl } = request.body;
    
    // 1. Vercel Blob'dan dosyayı sil
    if (blobUrl) {
      await del(blobUrl);
    }
    
    // 2. Postgres veritabanından kaydı sil
    await sql`DELETE FROM gallery_images WHERE id = ${id};`;
    
    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}