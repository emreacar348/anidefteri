import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // Vercel, FormData'yı otomatik olarak parse eder. Dosya 'file' alanındadır.
    const file = request.files.file;
    const altText = request.body.altText;
    
    // Dosyayı Vercel Blob'a yükle
    const blob = await put(file.originalFilename, file, { access: 'public' });

    // Veritabanına Blob URL'ini ve diğer bilgileri kaydet
    await sql`INSERT INTO gallery_images (url, alt_text, blob_url) VALUES (${blob.url}, ${altText}, ${blob.url});`;
    
    return response.status(200).json({ success: true, blob });
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
}
// Not: Bu fonksiyonun çalışması için Vercel ayarlarından "Enable Edge Functions for serverless functions" seçeneğini
// aktif etmeniz veya projenizi Next.js gibi bir framework'e taşımanız gerekebilir, çünkü standart
// serverless fonksiyonlar dosya yüklemeyi bu şekilde direkt desteklemeyebilir.
// Eğer hata alırsanız, bu API endpoint'i için "Edge Function" olarak ayarlandığından emin olun.