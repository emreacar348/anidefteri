// script.js
// Bu kod bloğu, DOMContentLoaded'dan önce çalışmalıdır,
// çünkü sayfa yüklenmeden önce yönlendirme kontrolü yapılması gerekir.

// **********************************************
// ÖNEMLİ: Kimlik Doğrulama Kontrolü (Client-side, güvenlik için YETERSİZ)
// **********************************************
// Bu, sadece frontend tarafında bir simülasyondur.
// Gerçek uygulamada bu kontrol backend tarafından yapılmalı ve güvenli oturumlar kullanılmalıdır.

// Sadece index.html'ye erişimi kısıtla, login.html için değil.
const currentPage = window.location.pathname.split('/').pop(); // Sadece dosya adını al

if (currentPage === 'index.html' || currentPage === '') { // Ana sayfa veya kök dizin ise
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Oturum durumunu kontrol et

    // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    if (!isLoggedIn) {
        window.location.replace('login.html'); // Tarayıcı geçmişinde bırakmamak için replace kullan
    }
}

// Tüm DOM ile ilgili işlemler DOMContentLoaded içinde olmalı
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------
    // Yapılacaklar Listesi Logic
    // ----------------------------
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    // Helper fonksiyon: Yapılacaklar listesini localStorage'a kaydet
    function saveTodos() {
        const todos = [];
        todoList.querySelectorAll('li span').forEach(span => {
            todos.push(span.textContent); // Her bir görev metnini al
        });
        localStorage.setItem('todos', JSON.stringify(todos)); // Diziyi JSON string'ine çevirerek kaydet
    }

    function createTodoItem(text) {
        const listItem = document.createElement('li');
        listItem.className = 'bg-slate-50 p-4 rounded-lg shadow-sm flex items-center justify-between';
        listItem.innerHTML = `
            <span class="text-lg text-slate-700">${text}</span>
            <button class="delete-todo-btn text-red-500 hover:text-red-700 font-bold px-2" aria-label="Görevi sil">X</button>
        `;
        return listItem;
    }

    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const newItem = createTodoItem(todoText);
            todoList.appendChild(newItem);
            todoInput.value = '';
            todoInput.focus();
            saveTodos(); // Yeni görev eklendiğinde kaydet
        }
    }

    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', addTodoItem);
    }

    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodoItem();
            }
        });
    }

    if (todoList) {
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-todo-btn')) {
                e.target.closest('li').remove();
                saveTodos(); // Görev silindiğinde kaydet
            }
        });
    }

    // Yapılacaklar Listesini localStorage'dan Yükleme (Sayfa Yüklendiğinde)
    function loadTodos() {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            const todos = JSON.parse(savedTodos);
            todoList.innerHTML = ''; // HTML'deki mevcut listeyi temizle
            todos.forEach(todoText => {
                const newItem = createTodoItem(todoText);
                todoList.appendChild(newItem);
            });
        } else {
            // Eğer hiç kaydedilmiş görev yoksa başlangıçtaki örnek görevleri ekle
            const initialTodos = [
                'Deniz kenarında piknik yapmak',
                'Yeni bir dil öğrenmeye başlamak',
                'Beraber bir film maratonu yapmak'
            ];
            todoList.innerHTML = ''; // HTML'deki mevcut listeyi temizle
            initialTodos.forEach(todoText => {
                const newItem = createTodoItem(todoText);
                todoList.appendChild(newItem);
            });
            saveTodos(); // Başlangıçtaki görevleri de kaydet
        }
    }

    // Sayfa yüklendiğinde görevleri yükle
    if (todoList) {
        loadTodos();
    }


    // ----------------------------
    // Geri Sayım Sayaç Logic
    // ----------------------------
    function startCountdown() {
        // Mevcut yıla göre 24 Ağustos'u hedefle
        let targetDate = new Date(`AUGUST 24, ${new Date().getFullYear()} 00:00:00`).getTime();

        // Eğer hedef tarih şimdiki zamandan geçmişse, bir sonraki yıla ayarla
        if (targetDate < new Date().getTime()) {
            targetDate = new Date(`AUGUST 24, ${new Date().getFullYear() + 1} 00:00:00`).getTime();
        }

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            let distance = targetDate - now;

            if (distance < 0) { // Eğer yıl dönümü anı geçmişse, hemen bir sonraki yılı hedefle
                targetDate = new Date(new Date(targetDate).setFullYear(new Date(targetDate).getFullYear() + 1)).getTime();
                distance = targetDate - now; // Yeni mesafeyi tekrar hesapla
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days;
            hoursEl.textContent = hours;
            minutesEl.textContent = minutes;
            secondsEl.textContent = seconds;
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // Sadece countdown-timer elementi varsa başlat
    if (document.getElementById('countdown-timer')) {
        startCountdown();
    }

    // ----------------------------
    // Etkinlik Çarkı Logic
    // ----------------------------
    const activities = [
        { id: 'sinema', title: 'Evde Sinema Gecesi', description: 'Beraber battaniyeye sarılıp film izleyelim.', icon: '🍿' },
        { id: 'kurabiye', title: 'Kurabiye Yapımı', description: 'Birlikte mutfağa girip kurabiye yapalım.', icon: '🍪' },
        { id: 'oyun', title: 'Oyun Gecesi', description: 'İkili oyunlar oynayıp kahkahalar atalım.', icon: '🎮' },
        { id: 'temizlik', title: 'Birlikte Temizlik', description: 'Müzik açıp dans ederek evi toparlayalım.', icon: '🧼' },
        { id: 'resim', title: 'Resim Yapma', description: 'Beraber tuvale veya dijitale duygularımızı dökelim.', icon: '🎨' },
        { id: 'kitap', title: 'Kitap Okuma Saati', description: 'Aynı kitabı okuyup sonra sohbet edelim.', icon: '📚' },
        { id: 'yoga', title: 'Yoga/Stretching', description: 'Beraber rahatlayalım, nefes alalım.', icon: '🧘‍' },
        { id: 'muzik', title: 'Müzik Gecesi', description: 'Sevdiğimiz şarkılarla mini bir konser yapalım.', icon: '🎶' },
        { id: 'yemek', title: 'Birlikte Yemek Tarifi Deneme', description: 'Yeni bir tarif bulup deneyelim.', icon: '🧑‍🍳' }
    ];

    const wheelCanvas = document.getElementById('activityWheel');
    const spinButton = document.getElementById('spinButton');
    const selectedActivityDisplay = document.getElementById('selectedActivityDisplay');

    let wheelChart;
    let animationFrameId = null;

    if (wheelCanvas) {
        wheelChart = new Chart(wheelCanvas, {
            type: 'pie',
            data: {
                labels: activities.map(a => a.title),
                datasets: [{
                    data: Array(activities.length).fill(1),
                    backgroundColor: [
                        '#FDD8D8', '#FAE3D9', '#FFF3B0', '#E5FFCC', '#CCEDFF',
                        '#D4D4FD', '#E0CCFF', '#FFCCE5', '#CCE5FF'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '0%',
                rotation: 0,
                animation: { duration: 0 },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function startSpin() {
        if (animationFrameId) return;

        spinButton.disabled = true;
        selectedActivityDisplay.innerHTML = '<p class="text-slate-500 text-center">Çark dönüyor...</p>';

        const numberOfSegments = activities.length;
        const degreesPerSegment = 360 / numberOfSegments;
        const randomIndex = Math.floor(Math.random() * numberOfSegments);
        const selectedActivity = activities[randomIndex];

        const segmentCenterAngle = (randomIndex * degreesPerSegment) + (degreesPerSegment / 2);
        const targetRotation = (360 - segmentCenterAngle) + (360 * 10);

        const duration = 5000;
        let startTime = null;
        const initialRotation = wheelChart.options.rotation;

        function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            wheelChart.options.rotation = initialRotation + (targetRotation - initialRotation) * easedProgress;
            wheelChart.update();

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateSpin);
            } else {
                animationFrameId = null;
                spinButton.disabled = false;
                displaySelectedActivity(selectedActivity);
            }
        }

        animationFrameId = requestAnimationFrame(animateSpin);
    }

    function displaySelectedActivity(activity) {
        selectedActivityDisplay.innerHTML = `
            <div class="bg-indigo-50 p-6 rounded-lg text-center flex flex-col items-center justify-center animate-fade-in-up">
                <span class="text-5xl mb-4">${activity.icon}</span>
                <h4 class="text-2xl font-semibold text-indigo-700 mb-2">${activity.title}</h4>
                <p class="text-slate-600">${activity.description}</p>
            </div>
        `;
    }

    // Sadece spinButton elementi varsa dinleyici ekle
    if (spinButton) {
        spinButton.addEventListener('click', startSpin);
    }

    // ----------------------------
    // Fotoğraf Galerisi Modal Logic (Mevcut kodunuzdaki modal açma kısmı)
    // ----------------------------
    // NOT: galleryImages değişkeni, aşağıdaki yeni kodda renderGallery() içinde dinamik olarak yönetiliyor.
    // Bu kısmı, aşağıda entegre ettiğim renderGallery() ve createGalleryItem() fonksiyonları devralacak.
    // Bu yüzden bu bloğun içeriği aşağıdaki "Yeni Fotoğraf Galerisi Logic" içinde ele alınmıştır.
    const photoModal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            photoModal.classList.remove('show');
        });
    }

    if (photoModal) {
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) {
                photoModal.classList.remove('show');
            }
        });
    }

    // Klavye ile kapatma (ESC tuşu)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoModal && photoModal.classList.contains('show')) {
            photoModal.classList.remove('show');
        }
    });

    // ----------------------------
    // YENİ: Fotoğraf Galerisi Yükleme ve Yönetim Logic'i (Daha önceki konuşmamızdaki haliyle entegre edildi)
    // ----------------------------
    const imageUpload = document.getElementById('imageUpload');
    const addImageBtn = document.getElementById('addImageBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const galleryGrid = document.getElementById('gallery-grid');

    // Yardımcı Fonksiyon: Galeriyi localStorage'a kaydet
    function saveGalleryImages(images) {
        localStorage.setItem('galleryImages', JSON.stringify(images));
    }

    // Yardımcı Fonksiyon: Galeriyi localStorage'dan yükle
    function loadGalleryImages() {
        const savedImages = localStorage.getItem('galleryImages');
        return savedImages ? JSON.parse(savedImages) : [];
    }

    // Yardımcı Fonksiyon: Galeri öğesini HTML'e oluşturur
    function createGalleryItem(imageSrc, altText) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item relative';
        galleryItem.innerHTML = `
            <img src="${imageSrc}" data-full="${imageSrc}" alt="${altText || 'Galerimdeki bir fotoğraf'}"
                class="w-full h-full object-cover cursor-pointer" loading="lazy">
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>${altText || 'Yeni Fotoğraf'}</span>
            </div>
            <button class="delete-gallery-item-btn absolute top-2 right-2 text-gray-400 hover:text-red-600" aria-label="Fotoğrafı sil">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        // Silme butonuna event listener ekle
        galleryItem.querySelector('.delete-gallery-item-btn').addEventListener('click', (e) => {
            const itemToRemove = e.target.closest('.gallery-item');
            if (itemToRemove) {
                const imgElement = itemToRemove.querySelector('img');
                if (imgElement) {
                    deleteGalleryImage(imgElement.src); // Resmi sil
                }
            }
        });

        // Fotoğraf modalını açmak için event listener ekle
        galleryItem.querySelector('img').addEventListener('click', () => {
            modalImage.src = imageSrc;
            photoModal.classList.add('show');
            // Odaklama zaten global olarak klavye ile kapatma için tanımlanmış.
            // modalImage.focus(); // Gerekliyse tekrar odaklayabiliriz
        });

        return galleryItem;
    }

    // Fonksiyon: Galeriyi yeniden render et
    function renderGallery() {
        let currentImages = loadGalleryImages();
        
        // Eğer localStorage boşsa, HTML'deki varsayılan resimleri ekle
        // Bu kısım, HTML'deki statik resimlerin bir kereliğine localStorage'a aktarılmasını sağlar.
        if (currentImages.length === 0) {
            // Sadece başlangıçta HTML'deki resimleri al ve localStorage'a ekle
            // HTML'deki resimlerin data-full niteliği yerine src'si kullanılıyor
            document.querySelectorAll('#gallery-grid > .gallery-item img').forEach(img => {
                currentImages.push({ src: img.src, alt: img.alt });
            });
            saveGalleryImages(currentImages); // Varsayılanları kaydet
        }

        // Mevcut galeriyi temizle
        galleryGrid.innerHTML = ''; 

        // Tüm resimleri (varsayılanlar + yüklenenler) render et
        currentImages.forEach(imgData => {
            galleryGrid.appendChild(createGalleryItem(imgData.src, imgData.alt));
        });
    }

    // Fonksiyon: Galeriden fotoğraf sil
    function deleteGalleryImage(imageSrcToDelete) {
        let currentImages = loadGalleryImages();
        const updatedImages = currentImages.filter(img => img.src !== imageSrcToDelete);
        saveGalleryImages(updatedImages);
        renderGallery(); // Galeriyi yeniden çiz
    }

    // Butona tıklanınca gizli input'u tetikle
    if (addImageBtn) {
        addImageBtn.addEventListener('click', () => {
            imageUpload.click(); // input type="file" elementini programatik olarak tıklar
        });
    }

    // Dosya seçildiğinde
    if (imageUpload) {
        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    uploadStatus.textContent = 'Hata: Lütfen bir görsel dosyası seçin.';
                    uploadStatus.className = 'text-sm mt-2 text-red-600';
                    uploadStatus.classList.remove('hidden');
                    return;
                }

                uploadStatus.textContent = 'Fotoğraf yükleniyor...';
                uploadStatus.className = 'text-sm mt-2 text-indigo-600';
                uploadStatus.classList.remove('hidden');

                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Image = e.target.result; // Base64 string'i
                    const altText = prompt('Bu fotoğraf için bir açıklama girin (isteğe bağlı):') || '';

                    let currentImages = loadGalleryImages();
                    currentImages.push({ src: base64Image, alt: altText });
                    saveGalleryImages(currentImages); // Yeni resmi kaydet

                    renderGallery(); // Galeriyi yeniden çiz
                    
                    uploadStatus.textContent = 'Fotoğraf başarıyla eklendi!';
                    uploadStatus.className = 'text-sm mt-2 text-green-600';
                    setTimeout(() => {
                        uploadStatus.classList.add('hidden');
                    }, 3000);
                };
                reader.onerror = () => {
                    uploadStatus.textContent = 'Dosya okuma hatası.';
                    uploadStatus.className = 'text-sm mt-2 text-red-600';
                };
                reader.readAsDataURL(file); // Dosyayı Base64 olarak oku
            }
        });
    }

    // Sayfa yüklendiğinde galeriyi render et
    // Bu kısım, galerinin başlangıçta ve her değişiklikte güncellenmesini sağlar.
    if (galleryGrid) {
        renderGallery();
    }


    // ----------------------------
    // Mesaj Kutusu Gönderim Logic (localStorage Eklendi)
    // ----------------------------
    const messageForm = document.getElementById('messageForm');
    const messageStatus = document.getElementById('messageStatus');
    const messageTextarea = document.getElementById('messageTextarea');

    // Mesajları localStorage'a kaydeden yardımcı fonksiyon
    function saveMessage(message) {
        let messages = localStorage.getItem('userMessages');
        messages = messages ? JSON.parse(messages) : [];
        messages.push({
            text: message,
            timestamp: new Date().toLocaleString('tr-TR')
        });
        localStorage.setItem('userMessages', JSON.stringify(messages));
    }

    // Mesajları localStorage'dan yükleyip döndüren fonksiyon
    function loadMessages() {
        const savedMessages = localStorage.getItem('userMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    }

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const messageContent = messageTextarea.value.trim();

            if (messageContent === '') {
                messageStatus.textContent = 'Lütfen bir mesaj yazın.';
                messageStatus.classList.remove('hidden', 'text-green-600');
                messageStatus.classList.add('text-red-600');
                setTimeout(() => {
                    messageStatus.classList.add('hidden');
                    messageStatus.classList.remove('text-red-600');
                }, 3000);
                return;
            }

            saveMessage(messageContent); // Mesajı localStorage'a kaydet

            messageStatus.textContent = 'Mesajın başarıyla gönderildi!';
            messageStatus.classList.remove('hidden', 'text-red-600');
            messageStatus.classList.add('text-green-600');
            messageForm.reset();
            setTimeout(() => {
                messageStatus.classList.add('hidden');
                messageStatus.classList.remove('text-green-600', 'text-red-600');
            }, 3000);
        });
    }

    // ----------------------------
    // Mesaj Kontrol ve Yönetim Logic'i
    // ----------------------------
    const adminMessagesSection = document.getElementById('adminMessages');
    const messagesList = document.getElementById('messagesList');
    const clearMessagesBtn = document.getElementById('clearMessagesBtn');

    // Mesajları HTML'e çizen fonksiyon
    function renderMessages() {
        const messages = loadMessages(); // Mesajları yükle
        messagesList.innerHTML = ''; // Listeyi temizle

        if (messages.length === 0) {
            messagesList.innerHTML = '<p class="text-center text-slate-500">Henüz gönderilmiş bir mesaj yok.</p>';
            clearMessagesBtn.classList.add('hidden'); // Mesaj yoksa temizle butonunu gizle
            return;
        }

        clearMessagesBtn.classList.remove('hidden'); // Mesaj varsa temizle butonunu göster

        messages.forEach((msg, index) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'bg-slate-100 p-4 rounded-lg shadow-sm relative';
            messageDiv.innerHTML = `
                <p class="text-slate-800 break-words">${msg.text}</p>
                <p class="text-sm text-slate-500 mt-2 text-right">${msg.timestamp}</p>
                <button class="delete-single-message-btn absolute top-2 right-2 text-gray-400 hover:text-red-600" data-index="${index}" aria-label="Bu mesajı sil">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            `;
            messagesList.appendChild(messageDiv);
        });
    }

    // Tek bir mesajı silme fonksiyonu
    if (messagesList) {
        messagesList.addEventListener('click', (e) => {
            if (e.target.closest('.delete-single-message-btn')) {
                const btn = e.target.closest('.delete-single-message-btn');
                const indexToDelete = parseInt(btn.dataset.index);

                let messages = loadMessages();
                messages.splice(indexToDelete, 1);

                localStorage.setItem('userMessages', JSON.stringify(messages));
                renderMessages(); // Listeyi yeniden çiz
            }
        });
    }

    // Tüm mesajları temizleme fonksiyonu
    if (clearMessagesBtn) {
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm('Tüm mesajları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                localStorage.removeItem('userMessages');
                renderMessages(); // Listeyi yeniden çiz (boş görünecek)
            }
        });
    }

    // URL kontrolü yaparak mesajlar bölümünü göster/gizle
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('show') === 'messages') {
        if (adminMessagesSection) { // adminMessagesSection'ın varlığını kontrol et
            adminMessagesSection.classList.remove('hidden');
            renderMessages(); // Mesajları çiz
        }
    } else {
        if (adminMessagesSection) { // adminMessagesSection'ın varlığını kontrol et
            adminMessagesSection.classList.add('hidden');
        }
    }

}); // DOMContentLoaded kapanış parantezi