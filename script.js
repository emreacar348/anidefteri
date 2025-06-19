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
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Oturum durumunu kontrol et

    // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    if (!isLoggedIn) {
        window.location.replace('login.html'); // Tarayıcı geçmişinde bırakmamak için replace kullan
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const musicToggleButton = document.getElementById('music-toggle-btn');
    const musicPanel = document.getElementById('music-panel');
    const playPauseButton = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const volumeSlider = document.getElementById('volume-slider');
    const backgroundMusic = document.getElementById('background-music');
    const closeMusicPanelBtn = document.getElementById('close-music-panel-btn'); // Kapat butonu

    // Eğer müzik elementleri varsa çalıştır
    if (musicToggleButton && musicPanel && playPauseButton && volumeSlider && backgroundMusic) {
        // Sayfa yüklendiğinde son ses seviyesini ayarla veya varsayılan 0.5 yap
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null) {
            backgroundMusic.volume = parseFloat(savedVolume);
            volumeSlider.value = parseFloat(savedVolume);
        } else {
            backgroundMusic.volume = 0.5; // Varsayılan ses seviyesi
            volumeSlider.value = 0.5;
        }

        // Müzik paneli toggle (açma/kapama)
        musicToggleButton.addEventListener('click', () => {
            musicPanel.classList.toggle('hidden'); // hidden sınıfını kaldır/ekle
            if (!musicPanel.classList.contains('hidden')) {
                // Eğer panel açılırsa, animasyon için ek sınıfları ekle
                musicPanel.classList.add('translate-y-0', 'opacity-100');
                musicPanel.classList.remove('translate-y-4', 'opacity-0');
            } else {
                // Eğer panel kapanırsa, animasyon için ek sınıfları kaldır
                musicPanel.classList.add('translate-y-4', 'opacity-0');
                musicPanel.classList.remove('translate-y-0', 'opacity-100');
            }
        });

        // Panel kapat butonu
        if (closeMusicPanelBtn) {
            closeMusicPanelBtn.addEventListener('click', () => {
                musicPanel.classList.add('hidden', 'translate-y-4', 'opacity-0');
                musicPanel.classList.remove('translate-y-0', 'opacity-100');
            });
        }


        // Oynat/Duraklat butonu
        playPauseButton.addEventListener('click', () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    playIcon.classList.add('hidden');
                    pauseIcon.classList.remove('hidden');
                }).catch(error => {
                    console.error("Müzik çalma hatası:", error);
                    // Kullanıcıya bilgi ver (örn: "Müzik otomatik oynatılamadı, lütfen sayfayla etkileşim kurun.")
                });
            } else {
                backgroundMusic.pause();
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        });

        // Ses seviyesi ayarı
        volumeSlider.addEventListener('input', () => {
            backgroundMusic.volume = volumeSlider.value;
            localStorage.setItem('musicVolume', volumeSlider.value); // Ses seviyesini kaydet
        });

        // Müzik bittiğinde veya duraklatıldığında ikonları güncelle
        backgroundMusic.addEventListener('play', () => {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        });

        backgroundMusic.addEventListener('pause', () => {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        });

        // Tarayıcının autoplay kısıtlamalarını ele almak için
        // İlk kullanıcı etkileşiminde müziği çalmayı deneme
        document.body.addEventListener('click', function tryPlayMusicOnce() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().then(() => {
                    console.log("Müzik başarıyla çalmaya başladı.");
                }).catch(error => {
                    console.warn("Otomatik oynatma engellendi veya hata oluştu:", error);
                    // Eğer kullanıcı ilk tıklamasıyla bile oynatılmıyorsa,
                    // muhtemelen tarayıcının medya ayarları çok kısıtlayıcıdır.
                });
            }
            // Müzik bir kere çalmaya başladıktan sonra bu dinleyiciyi kaldır
            document.body.removeEventListener('click', tryPlayMusicOnce);
        }, { once: true }); // Sadece bir kere çalışmasını sağla

        // İleri/Geri Sarma butonları (Eğer birden fazla şarkı olacaksa eklenecek)
        // const prevSongBtn = document.getElementById('prev-song-btn');
        // const nextSongBtn = document.getElementById('next-song-btn');
        // Bu butonların mantığı için, bir şarkı listesi ve currentSongIndex gibi bir değişkene ihtiyacımız olur.
    }
    
    // ----------------------------
    // Navigasyon Aktif Bağlantı İzleme
    // ----------------------------
    const navLinks = document.querySelectorAll('#main-nav a');
    const sections = document.querySelectorAll('main section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => observer.observe(section));

    // ----------------------------
    // Geri Sayım Sayaç Logic
    // ----------------------------
    function startCountdown() {
        // Hedef yıl dönümü: Başlangıç tarihi olarak 24 Ağustos 2024'ü alalım.
        let targetDate = new Date('AUGUST 24, 2024 00:00:00').getTime();

        // Eğer hedef tarih geçmişse, bir sonraki yılın aynı tarihine ayarla
        while (targetDate < new Date().getTime()) {
            targetDate = new Date(new Date(targetDate).setFullYear(new Date(targetDate).getFullYear() + 1)).getTime();
        }

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            let distance = targetDate - now;

            // Eğer yıldönümü anı geçmişse, hemen bir sonraki yılı hedefle ve tekrar hesapla
            if (distance < 0) {
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

        updateCountdown(); // İlk çalıştırma
        setInterval(updateCountdown, 1000); // Her saniye güncelle
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
    // Fotoğraf Galerisi Modal Logic
    // ----------------------------
    const galleryImages = document.querySelectorAll('#gallery-grid img');
    const photoModal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.dataset.full;
            photoModal.classList.add('show');
            modalImage.focus(); // Modal açıldığında odak yönetimini iyileştir
        });
    });

    if (closeButton) { // closeButton elementi varsa dinleyici ekle
        closeButton.addEventListener('click', () => {
            photoModal.classList.remove('show');
        });
    }

    if (photoModal) { // photoModal elementi varsa dinleyici ekle
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
    // Yapılacaklar Listesi Logic (Event Delegation ile)
    // ----------------------------
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

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
            todoInput.focus(); // Yeni öğe eklendikten sonra girişe odaklan
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

    // Olay Delegasyonu: todoList'e bir dinleyici ekleyerek tüm silme butonlarını yönet
    if (todoList) {
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-todo-btn')) {
                e.target.closest('li').remove();
            }
        });
    }

    // ----------------------------
    // Mesaj Kutusu Gönderim Logic
    // ----------------------------
    const messageForm = document.getElementById('messageForm');
    const messageStatus = document.getElementById('messageStatus');
    const messageTextarea = document.getElementById('messageTextarea');

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (messageTextarea.value.trim() === '') {
                messageStatus.textContent = 'Lütfen bir mesaj yazın.';
                messageStatus.classList.remove('hidden', 'text-green-600');
                messageStatus.classList.add('text-red-600');
                setTimeout(() => {
                    messageStatus.classList.add('hidden');
                    messageStatus.classList.remove('text-red-600');
                }, 3000);
                return;
            }

            // Simülasyon devam ediyor, backend entegrasyonu için yorum satırı örneği bırakıldı
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
});