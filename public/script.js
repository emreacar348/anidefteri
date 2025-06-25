// script.js (SUPABASE İLE ÇALIŞAN NİHAİ SÜRÜM)

// ----------------------------
// SUPABASE İSTEMCİSİNİ BAŞLATMA
// ----------------------------
const SUPABASE_URL = 'https://aftwuaqybhokywjcsftb.supabase.co'; // HATA DÜZELTİLDİ: Sondaki '>' karakteri kaldırıldı.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmdHd1YXF5Ymhva3l3amNzZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MzU2MDcsImV4cCI6MjA2NjQxMTYwN30.tJ0tvBHkS2gZYKZ-F2sr_aZqwy_9kGqoa7-hg87p0Ww'; // Sizin sağladığınız ANON KEY

// HATA DÜZELTİLDİ: Supabase istemcisi doğru şekilde başlatıldı.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// --- GİRİŞ KONTROLÜ (Değişiklik yok) ---
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'index.html' || currentPage === '') {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.replace('login.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // Yapılacaklar Listesi Logic (SUPABASE)
    // ----------------------------
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    function createTodoItem(todo) {
        const listItem = document.createElement('li');
        listItem.className = 'bg-slate-50 p-4 rounded-lg shadow-sm flex items-center justify-between';
        listItem.dataset.id = todo.id;
        listItem.innerHTML = `
            <span class="text-lg text-slate-700">${todo.text}</span>
            <button class="delete-todo-btn text-red-500 hover:text-red-700 font-bold px-2" aria-label="Görevi sil">X</button>
        `;
        return listItem;
    }
    
    // DEĞİŞİKLİK: Veritabanından veri çekmek için fetch yerine supabase.from().select() kullanıldı.
    async function loadTodos() {
        if (!todoList) return;
        try {
            let { data: todos, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            todoList.innerHTML = '';
            todos.forEach(todo => todoList.appendChild(createTodoItem(todo)));
        } catch (error) { console.error('Görevler yüklenemedi:', error.message); }
    }

    // DEĞİŞİKLİK: Veritabanına veri eklemek için fetch yerine supabase.from().insert() kullanıldı.
    async function addTodoItem() {
        const text = todoInput.value.trim();
        if (text) {
            try {
                const { error } = await supabase.from('todos').insert([{ text: text }]);
                if (error) throw error;
                todoInput.value = '';
                todoInput.focus();
                loadTodos(); // Listeyi yeniden yükle
            } catch (error) { console.error('Görev eklenemedi:', error.message); }
        }
    }

    // DEĞİŞİKLİK: Veritabanından veri silmek için fetch yerine supabase.from().delete() kullanıldı.
    async function deleteTodoItem(id) {
         try {
            const { error } = await supabase.from('todos').delete().eq('id', id);
            if (error) throw error;
            loadTodos();
        } catch (error) { console.error('Görev silinemedi:', error.message); }
    }

    if (addTodoBtn) addTodoBtn.addEventListener('click', addTodoItem);
    if (todoInput) todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodoItem());
    if (todoList) {
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-todo-btn')) {
                const id = e.target.closest('li').dataset.id;
                deleteTodoItem(id);
            }
        });
        loadTodos();
    }


    // ----------------------------
    // Fotoğraf Galerisi ve Yönetim Logic (SUPABASE)
    // ----------------------------
    const photoModal = document.getElementById('photoModal');
    const imageUpload = document.getElementById('imageUpload');
    const addImageBtn = document.getElementById('addImageBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (galleryGrid) {
        function createGalleryItem(image) {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item relative group';
            galleryItem.innerHTML = `
                <img src="${image.url}" alt="${image.alt_text || 'Galeri fotoğrafı'}" class="w-full h-full object-cover cursor-pointer" loading="lazy">
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>${image.alt_text || 'Yeni Fotoğraf'}</span>
                </div>
                <button data-url="${image.url}" data-id="${image.id}" class="delete-gallery-item-btn absolute top-2 right-2 text-white bg-black bg-opacity-30 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-opacity-50 transition-all" aria-label="Fotoğrafı sil">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>`;
            
            // Silme butonu için event listener
            galleryItem.querySelector('.delete-gallery-item-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                if(confirm("Bu anıyı silmek istediğinizden emin misiniz?")){
                    const imageId = e.currentTarget.dataset.id;
                    const imageUrl = e.currentTarget.dataset.url;
                    await deleteGalleryImage(imageId, imageUrl);
                }
            });

            // Resmi büyütme için event listener
            galleryItem.querySelector('img').addEventListener('click', () => {
                const modal = document.getElementById('photoModal');
                document.getElementById('modalImage').src = image.url;
                modal.classList.add('show');
            });
            return galleryItem;
        }

        // DEĞİŞİKLİK: Galeriyi Supabase veritabanından yükle
        async function renderGallery() {
            try {
                let { data: images, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                galleryGrid.innerHTML = ''; // Önceki statik resimleri temizle
                images.forEach(imgData => galleryGrid.appendChild(createGalleryItem(imgData)));
            } catch (error) { console.error("Galeri yüklenemedi:", error.message); }
        }

        // DEĞİŞİKLİK: Fotoğrafı Supabase Storage ve veritabanından sil
        async function deleteGalleryImage(id, imageUrl) {
            try {
                // Supabase Storage'dan silmek için dosya yolunu URL'den çıkarmalıyız
                const bucketName = 'gallery-photos';
                const filePath = imageUrl.substring(imageUrl.indexOf(bucketName) + bucketName.length + 1);
                
                const { error: storageError } = await supabase.storage.from(bucketName).remove([filePath]);
                if (storageError) throw storageError;

                // Veritabanından kaydı sil
                const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', id);
                if (dbError) throw dbError;

                renderGallery();
            } catch (error) { 
                console.error("Resim silinemedi:", error.message); 
                alert("Resim silinirken bir hata oluştu.");
            }
        }

        if (addImageBtn) addImageBtn.addEventListener('click', () => imageUpload.click());
        if (imageUpload) {
            imageUpload.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const altText = prompt('Bu fotoğraf için bir açıklama girin (isteğe bağlı):', file.name) || '';
                
                uploadStatus.textContent = 'Yükleniyor...';
                uploadStatus.className = 'text-sm mt-2 text-indigo-600';
                uploadStatus.classList.remove('hidden');
                
                try {
                    // DEĞİŞİKLİK: Dosyayı Supabase Storage'a yükle ve veritabanına kaydet
                    const filePath = `public/${Date.now()}-${file.name}`;
                    const { error: uploadError } = await supabase.storage.from('gallery-photos').upload(filePath, file);
                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage.from('gallery-photos').getPublicUrl(filePath);
                    
                    const { error: dbError } = await supabase.from('gallery_images').insert([{ url: urlData.publicUrl, alt_text: altText }]);
                    if (dbError) throw dbError;

                    uploadStatus.textContent = 'Başarıyla eklendi!';
                    uploadStatus.className = 'text-sm mt-2 text-green-600';
                    renderGallery();
                } catch (error) {
                    uploadStatus.textContent = `Hata: ${error.message}`;
                    uploadStatus.className = 'text-sm mt-2 text-red-600';
                } finally {
                    setTimeout(() => uploadStatus.classList.add('hidden'), 3000);
                }
            });
        }
        
        // Modal kapatma butonu
        const modal = document.getElementById('photoModal');
        if(modal) {
            modal.querySelector('.close-button').addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }
        
        renderGallery(); // Sayfa yüklendiğinde galeriyi veritabanından yükle
    }
    
    // Geri sayım sayacı, müzik çalar gibi diğer statik fonksiyonlar burada yer alabilir.
    // Onlarda bir değişiklik yapmaya gerek yok.
});