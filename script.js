// script.js (Tüm Özellikler ve Son Güncellemeler Birleştirilmiş Nihai Sürüm)

// Bu kod bloğu, DOMContentLoaded'dan önce çalışmalıdır,
// çünkü sayfa yüklenmeden önce yönlendirme kontrolü yapılması gerekir.
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === 'index.html' || currentPage === '') {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.replace('login.html');
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

    function saveTodos() {
        const todos = [];
        todoList.querySelectorAll('li span').forEach(span => {
            todos.push(span.textContent);
        });
        localStorage.setItem('todos', JSON.stringify(todos));
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
            saveTodos();
        }
    }

    if (addTodoBtn) addTodoBtn.addEventListener('click', addTodoItem);
    if (todoInput) todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addTodoItem());
    if (todoList) {
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-todo-btn')) {
                e.target.closest('li').remove();
                saveTodos();
            }
        });
        // Sayfa yüklendiğinde görevleri yükle
        (function loadTodos() {
            const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
            todoList.innerHTML = '';
            savedTodos.forEach(todoText => {
                todoList.appendChild(createTodoItem(todoText));
            });
        })();
    }

    // ----------------------------
    // Geri Sayım Sayaç Logic
    // ----------------------------
    const countdownTimerEl = document.getElementById('countdown-timer');
    if (countdownTimerEl) {
        let targetDate = new Date(`AUGUST 24, ${new Date().getFullYear()} 00:00:00`).getTime();
        if (targetDate < new Date().getTime()) {
            targetDate = new Date(`AUGUST 24, ${new Date().getFullYear() + 1} 00:00:00`).getTime();
        }

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                targetDate = new Date(new Date(targetDate).setFullYear(new Date(targetDate).getFullYear() + 1)).getTime();
                return;
            }
            daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
            hoursEl.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            minutesEl.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            secondsEl.textContent = Math.floor((distance % (1000 * 60)) / 1000);
        };
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // ----------------------------
    // Etkinlik Çarkı Logic (SON GÜNCELLEME İLE TAMAMEN YENİLENDİ)
    // ----------------------------
    const wheelCanvas = document.getElementById('activityWheel');
    if (wheelCanvas) {
        const spinButton = document.getElementById('spinButton');
        const selectedActivityDisplay = document.getElementById('selectedActivityDisplay');
        const newActivityInput = document.getElementById('newActivityInput');
        const addActivityBtnFromWheel = document.getElementById('addActivityBtn'); // HTML'deki butonla eşleşiyor
        const activityList = document.getElementById('activityList');

        let wheelChart;
        let animationFrameId = null;
        let currentRotation = 0; // Kümülatif dönüşü takip etmek için

        const defaultActivities = [
             { title: 'Evde Sinema Gecesi', description: 'Battaniyeye sarılıp film izleyelim.', icon: '🍿', color: '#FDD8D8' },
             { title: 'Kurabiye Yapımı', description: 'Mutfakta harikalar yaratalım.', icon: '🍪', color: '#FAE3D9' },
             { title: 'Oyun Gecesi', description: 'Rekabet ve kahkaha bir arada!', icon: '🎮', color: '#FFF3B0' },
             { title: 'Dans Ederek Temizlik', description: 'Müzik eşliğinde evi parlatalım.', icon: '🧼', color: '#E5FFCC' },
             { title: 'Resim Yapma', description: 'Duygularımızı tuvale dökelim.', icon: '🎨', color: '#CCEDFF' }
        ];
        const colorPalette = ['#FDD8D8', '#FAE3D9', '#FFF3B0', '#E5FFCC', '#CCEDFF', '#D4D4FD', '#E0CCFF', '#FFCCE5'];
        let activities = JSON.parse(localStorage.getItem('coupleActivities')) || defaultActivities;

        const renderWheelAndList = () => {
            if(activityList) {
                activityList.innerHTML = '';
                activities.forEach((activity, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'flex items-center justify-between bg-slate-50 p-2 rounded';
                    listItem.innerHTML = `
                        <span class="text-slate-700">${activity.icon} ${activity.title}</span>
                        <button data-index="${index}" class="delete-activity-btn text-red-400 hover:text-red-600 font-bold px-2">&times;</button>
                    `;
                    activityList.appendChild(listItem);
                });
            }

            if (wheelChart) wheelChart.destroy();
            wheelChart = new Chart(wheelCanvas, {
                type: 'pie',
                data: {
                    labels: activities.map(a => `${a.icon} ${a.title}`),
                    datasets: [{
                        data: Array(activities.length).fill(1),
                        backgroundColor: activities.map(a => a.color),
                        borderColor: 'white',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false, rotation: currentRotation,
                    animation: { duration: 0 },
                    plugins: { legend: { display: false }, tooltip: { enabled: false } }
                }
            });
        };

        const addActivity = () => {
            const title = newActivityInput.value.trim();
            if (title) {
                const newActivity = {
                    title: title, description: 'Yeni bir macera bizi bekliyor!', icon: '🌟',
                    color: colorPalette[activities.length % colorPalette.length]
                };
                activities.push(newActivity);
                localStorage.setItem('coupleActivities', JSON.stringify(activities));
                newActivityInput.value = '';
                renderWheelAndList();
            }
        };

        const deleteActivity = (index) => {
            activities.splice(index, 1);
            localStorage.setItem('coupleActivities', JSON.stringify(activities));
            renderWheelAndList();
        };

        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

        const startSpin = () => {
            if (animationFrameId || activities.length === 0) return;
            spinButton.disabled = true;
            selectedActivityDisplay.innerHTML = '<p class="text-slate-500 text-center">Çark dönüyor...</p>';

            const randomIndex = Math.floor(Math.random() * activities.length);
            const selectedActivity = activities[randomIndex];
            const degreesPerSegment = 360 / activities.length;
            const stopAngle = (360 - (randomIndex * degreesPerSegment) - (degreesPerSegment / 2));
            const rotationAmount = (360 * 10) + stopAngle;

            const duration = 5000;
            let startTime = null;
            const startRotation = currentRotation;

            const animateSpin = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutQuart(progress);
                wheelChart.options.rotation = startRotation + (rotationAmount * easedProgress);
                wheelChart.update();

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animateSpin);
                } else {
                    currentRotation = wheelChart.options.rotation % 360;
                    animationFrameId = null;
                    spinButton.disabled = false;
                    displaySelectedActivity(selectedActivity);
                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
                    }
                }
            };
            animationFrameId = requestAnimationFrame(animateSpin);
        };
        
        const displaySelectedActivity = (activity) => {
            selectedActivityDisplay.innerHTML = `
                <div class="bg-indigo-50 p-6 rounded-lg text-center flex flex-col items-center justify-center animate-fade-in-up">
                    <span class="text-5xl mb-4">${activity.icon}</span>
                    <h4 class="text-2xl font-semibold text-indigo-700 mb-2">${activity.title}</h4>
                    <p class="text-slate-600">${activity.description}</p>
                </div>`;
        };
        
        if (spinButton) spinButton.addEventListener('click', startSpin);
        if (addActivityBtnFromWheel) addActivityBtnFromWheel.addEventListener('click', addActivity);
        if (newActivityInput) newActivityInput.addEventListener('keypress', (e) => e.key === 'Enter' && addActivity());
        if (activityList) {
            activityList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-activity-btn') || e.target.parentElement.classList.contains('delete-activity-btn')) {
                    const button = e.target.closest('.delete-activity-btn');
                    const index = parseInt(button.dataset.index);
                    deleteActivity(index);
                }
            });
        }
        renderWheelAndList();
    }


    // ----------------------------
    // Fotoğraf Galerisi ve Yönetim Logic
    // ----------------------------
    const photoModal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');
    const imageUpload = document.getElementById('imageUpload');
    const addImageBtn = document.getElementById('addImageBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const galleryGrid = document.getElementById('gallery-grid');

    if (closeButton) closeButton.addEventListener('click', () => photoModal.classList.remove('show'));
    if (photoModal) photoModal.addEventListener('click', (e) => e.target === photoModal && photoModal.classList.remove('show'));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && photoModal && photoModal.classList.contains('show') && photoModal.classList.remove('show'));

    if (galleryGrid) {
        const saveGalleryImages = (images) => localStorage.setItem('galleryImages', JSON.stringify(images));
        const loadGalleryImages = () => JSON.parse(localStorage.getItem('galleryImages') || '[]');

        const createGalleryItem = (imageSrc, altText) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item relative group';
            galleryItem.innerHTML = `
                <img src="${imageSrc}" alt="${altText || 'Galeri fotoğrafı'}" class="w-full h-full object-cover cursor-pointer" loading="lazy">
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>${altText || 'Yeni Fotoğraf'}</span>
                </div>
                <button class="delete-gallery-item-btn absolute top-2 right-2 text-white bg-black bg-opacity-30 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-opacity-50 transition-all" aria-label="Fotoğrafı sil">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>`;

            galleryItem.querySelector('.delete-gallery-item-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm("Bu anıyı silmek istediğinizden emin misiniz?")){
                    deleteGalleryImage(imageSrc);
                }
            });

            galleryItem.querySelector('img').addEventListener('click', () => {
                modalImage.src = imageSrc;
                photoModal.classList.add('show');
            });
            return galleryItem;
        };

        const renderGallery = () => {
            let currentImages = loadGalleryImages();
            if (currentImages.length === 0 && document.querySelectorAll('#gallery-grid > .gallery-item').length > 0) {
                document.querySelectorAll('#gallery-grid > .gallery-item img').forEach(img => {
                    currentImages.push({ src: img.src, alt: img.alt });
                });
                saveGalleryImages(currentImages);
            }
            galleryGrid.innerHTML = '';
            currentImages.forEach(imgData => galleryGrid.appendChild(createGalleryItem(imgData.src, imgData.alt)));
        };

        const deleteGalleryImage = (imageSrcToDelete) => {
            const updatedImages = loadGalleryImages().filter(img => img.src !== imageSrcToDelete);
            saveGalleryImages(updatedImages);
renderGallery();
        };

        if (addImageBtn) addImageBtn.addEventListener('click', () => imageUpload.click());
        if (imageUpload) {
            imageUpload.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    uploadStatus.textContent = 'Yükleniyor...';
                    uploadStatus.className = 'text-sm mt-2 text-indigo-600';
                    uploadStatus.classList.remove('hidden');
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const altText = prompt('Bu fotoğraf için bir açıklama girin (isteğe bağlı):', file.name) || '';
                        let currentImages = loadGalleryImages();
                        currentImages.push({ src: e.target.result, alt: altText });
                        saveGalleryImages(currentImages);
                        renderGallery();
                        uploadStatus.textContent = 'Başarıyla eklendi!';
                        uploadStatus.className = 'text-sm mt-2 text-green-600';
                        setTimeout(() => uploadStatus.classList.add('hidden'), 3000);
                    };
                    reader.readAsDataURL(file);
                } else {
                    uploadStatus.textContent = 'Lütfen bir resim dosyası seçin.';
                    uploadStatus.className = 'text-sm mt-2 text-red-600';
                    uploadStatus.classList.remove('hidden');
                }
            });
        }
        renderGallery();
    }

    // ----------------------------
    // Mesaj Kutusu ve Yönetim Logic
    // ----------------------------
    const messageForm = document.getElementById('messageForm');
    const adminMessagesSection = document.getElementById('adminMessages');
    const urlParams = new URLSearchParams(window.location.search);

    const saveMessage = (message) => {
        let messages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        messages.push({ text: message, timestamp: new Date().toLocaleString('tr-TR') });
        localStorage.setItem('userMessages', JSON.stringify(messages));
    };

    if (messageForm) {
        const messageStatus = document.getElementById('messageStatus');
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageContent = document.getElementById('messageTextarea').value.trim();
            if (messageContent === '') {
                messageStatus.textContent = 'Lütfen bir mesaj yazın.';
                messageStatus.className = 'text-center mt-4 text-red-600';
            } else {
                saveMessage(messageContent);
                messageStatus.textContent = 'Mesajın başarıyla gönderildi!';
                messageStatus.className = 'text-center mt-4 text-green-600';
                e.target.reset();
            }
            messageStatus.classList.remove('hidden');
            setTimeout(() => messageStatus.classList.add('hidden'), 3000);
        });
    }

    if (urlParams.get('show') === 'messages' && adminMessagesSection) {
        const messagesList = document.getElementById('messagesList');
        const clearMessagesBtn = document.getElementById('clearMessagesBtn');
        const loadMessages = () => JSON.parse(localStorage.getItem('userMessages') || '[]');

        const renderMessages = () => {
            const messages = loadMessages();
            messagesList.innerHTML = '';
            if (messages.length === 0) {
                messagesList.innerHTML = '<p class="text-center text-slate-500">Henüz gönderilmiş bir mesaj yok.</p>';
                clearMessagesBtn.classList.add('hidden');
            } else {
                clearMessagesBtn.classList.remove('hidden');
                messages.forEach((msg, index) => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'bg-slate-100 p-4 rounded-lg shadow-sm relative';
                    messageDiv.innerHTML = `
                        <p class="text-slate-800 break-words">${msg.text}</p>
                        <p class="text-sm text-slate-500 mt-2 text-right">${msg.timestamp}</p>
                        <button class="delete-single-message-btn absolute top-2 right-2 text-gray-400 hover:text-red-600" data-index="${index}" aria-label="Bu mesajı sil">
                           &times;
                        </button>`;
                    messagesList.appendChild(messageDiv);
                });
            }
        };

        messagesList.addEventListener('click', (e) => {
            if (e.target.closest('.delete-single-message-btn')) {
                const btn = e.target.closest('.delete-single-message-btn');
                let messages = loadMessages();
                messages.splice(parseInt(btn.dataset.index), 1);
                localStorage.setItem('userMessages', JSON.stringify(messages));
                renderMessages();
            }
        });
        
        clearMessagesBtn.addEventListener('click', () => {
            if (confirm('Tüm mesajları silmek istediğinizden emin misiniz?')) {
                localStorage.removeItem('userMessages');
                renderMessages();
            }
        });
        
        adminMessagesSection.classList.remove('hidden');
        renderMessages();
    }
});