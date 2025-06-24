// script.js (Veritabanı Entegrasyonlu Nihai Sürüm)

// Bu kod bloğu, DOMContentLoaded'dan önce çalışmalıdır,
// çünkü sayfa yüklenmeden önce yönlendirme kontrolü yapılması gerekir.
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'index.html' || currentPage === '') {
    // localStorage'daki kontrol kalabilir, çünkü bu basit bir "giriş yapıldı mı?" bayrağıdır.
    // Dilerseniz bunu da API ile daha güvenli bir session yönetimine çevirebilirsiniz.
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.replace('login.html');
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // Yapılacaklar Listesi Logic (VERİTABANI)
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
    
    async function loadTodos() {
        try {
            const response = await fetch('/api/get-todos');
            const todos = await response.json();
            todoList.innerHTML = '';
            todos.forEach(todo => todoList.appendChild(createTodoItem(todo)));
        } catch (error) { console.error('Görevler yüklenemedi:', error); }
    }

    async function addTodoItem() {
        const text = todoInput.value.trim();
        if (text) {
            try {
                const response = await fetch('/api/add-todo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                if(response.ok) {
                    todoInput.value = '';
                    todoInput.focus();
                    loadTodos(); // Listeyi yeniden yükle
                }
            } catch (error) { console.error('Görev eklenemedi:', error); }
        }
    }

    async function deleteTodoItem(id) {
         try {
            const response = await fetch('/api/delete-todo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if(response.ok) loadTodos();
        } catch (error) { console.error('Görev silinemedi:', error); }
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
        loadTodos(); // Sayfa yüklendiğinde veritabanından görevleri yükle
    }


    // ----------------------------
    // Fotoğraf Galerisi ve Yönetim Logic (VERİTABANI & BLOB)
    // ----------------------------
    const photoModal = document.getElementById('photoModal');
    // ... (modal'ın diğer değişkenleri ve event listener'ları aynı kalabilir) ...
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
                <button class="delete-gallery-item-btn absolute top-2 right-2 text-white bg-black bg-opacity-30 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-opacity-50 transition-all" aria-label="Fotoğrafı sil">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>`;

            galleryItem.querySelector('.delete-gallery-item-btn').addEventListener('click', async (e) => {
                e.stopPropagation();
                if(confirm("Bu anıyı silmek istediğinizden emin misiniz?")){
                    await deleteGalleryImage(image.id, image.blob_url);
                }
            });

             galleryItem.querySelector('img').addEventListener('click', () => {
                document.getElementById('modalImage').src = image.url;
                photoModal.classList.add('show');
            });
            return galleryItem;
        }

        async function renderGallery() {
            try {
                const response = await fetch('/api/get-images');
                const images = await response.json();
                galleryGrid.innerHTML = '';
                images.forEach(imgData => galleryGrid.appendChild(createGalleryItem(imgData)));
            } catch (error) { console.error("Galeri yüklenemedi:", error); }
        }

        async function deleteGalleryImage(id, blobUrl) {
            try {
                await fetch('/api/delete-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, blobUrl })
                });
                renderGallery();
            } catch (error) { console.error("Resim silinemedi:", error); }
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

                const formData = new FormData();
                formData.append('file', file);
                formData.append('altText', altText);

                try {
                    const response = await fetch('/api/upload-image', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        uploadStatus.textContent = 'Başarıyla eklendi!';
                        uploadStatus.className = 'text-sm mt-2 text-green-600';
                        renderGallery();
                    } else {
                        const error = await response.json();
                        throw new Error(error.message);
                    }
                } catch (error) {
                    uploadStatus.textContent = `Hata: ${error.message}`;
                    uploadStatus.className = 'text-sm mt-2 text-red-600';
                } finally {
                    setTimeout(() => uploadStatus.classList.add('hidden'), 3000);
                }
            });
        }
        renderGallery();
    }
    
    // Diğer tüm özellikler (Etkinlik Çarkı, Mesaj Kutusu vb.) için de
    // benzer şekilde localStorage yerine fetch ile API çağırma mantığı uygulanmalıdır.
    // Bu cevapta en karmaşık iki örnek olan Yapılacaklar Listesi ve Fotoğraf Galerisi'ni
    // veritabanına bağladık. Diğerlerini de bu örneklerden yola çıkarak yapabilirsiniz.
});

// Geri sayım sayacı gibi sunucu verisi gerektirmeyen diğer tüm fonksiyonlar
// bu dosyanın ilgili yerlerinde aynen kalabilir.