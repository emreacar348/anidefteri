import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';

// Bu satır, fonksiyonun Node.js yerine Edge Runtime'da çalışmasını sağlar.
export const runtime = 'edge';

export default async function handler(request) {
  // Edge Runtime'da request objesi, modern web standartlarına uygun gelir.
  // Bu sayede .formData() metodunu kullanabiliriz.
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests allowed' }), { status: 405 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const altText = form.get('altText');

    // Gelen verinin dosya olup olmadığını kontrol edelim
    if (!file || typeof file === 'string') {
        return new Response(JSON.stringify({ message: 'No file provided or file is not valid' }), { status: 400 });
    }
    
    // Dosyayı Vercel Blob'a yükle
    // Dosya adını güvenli hale getirelim (isteğe bağlı ama önerilir)
    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const blob = await put(safeFilename, file, { access: 'public' });

    // Veritabanına Blob URL'ini ve diğer bilgileri kaydet
    await sql`
      INSERT INTO gallery_images (url, alt_text, blob_url) 
      VALUES (${blob.url}, ${altText}, ${blob.url});
    `;
    
    // Başarılı olursa, JSON cevabı döndür
    return new Response(JSON.stringify({ success: true, blob }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // Hata olursa, hatayı JSON olarak döndür
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}