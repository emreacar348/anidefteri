document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------
    // Navigasyon Aktif Bağlantı İzleme
    // ----------------------------
    // Geri Sayım Sayaç Logic
    function startCountdown() {
        const countdownDate = new Date('AUGUST 24, 2025 00:00:00').getTime(); // Bir sonraki yıldönümüAdd commentMore actions
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days;
            hoursEl.textContent = hours;
            minutesEl.textContent = minutes;
            secondsEl.textContent = seconds;

            if (distance < 0) {
                // Yıldönümü geçtiğinde, bir sonraki yıla geç
                countdownDate = new Date(countdownDate + 1000 * 60 * 60 * 24 * 365).getTime();
            }
        }

        updateCountdown(); // İlk çalıştırma
        setInterval(updateCountdown, 1000); // Her saniye güncelle
    }

    if (document.getElementById('countdown-timer')) {
        startCountdown();
    }
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
    // Etkinlik Çarkı Logic
    // ----------------------------
    const activities = [
        { id: 'sinema', title: 'Evde Sinema Gecesi', description: 'Beraber battaniyeye sarılıp film izleyelim.', icon: '🍿' },
        { id: 'kurabiye', title: 'Kurabiye Yapımı', description: 'Birlikte mutfağa girip kurabiye yapalım.', icon: '🍪' },
        { id: 'oyun', title: 'Oyun Gecesi', description: 'İkili oyunlar oynayıp kahkahalar atalım.', icon: '🎮' },
        { id: 'temizlik', title: 'Birlikte Temizlik', description: 'Müzik açıp dans ederek evi toparlayalım.', icon: '🧼' },
        { id: 'resim', title: 'Resim Yapma', description: 'Beraber tuvale veya dijitale duygularımızı dökelim.', icon: '🎨' },
        { id: 'kitap', title: 'Kitap Okuma Saati', description: 'Aynı kitabı okuyup sonra sohbet edelim.', icon: '📚' },
        { id: 'yoga', title: 'Yoga/Stretching', description: 'Beraber rahatlayalım, nefes alalım.', icon: '🧘' },
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
        });
    });

    closeButton.addEventListener('click', () => {
        photoModal.classList.remove('show');
    });

    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) {
            photoModal.classList.remove('show');
        }
    });

    // ----------------------------
    // Yapılacaklar Listesi Logic
    // ----------------------------
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            const listItem = document.createElement('li');
            listItem.className = 'bg-slate-50 p-4 rounded-lg shadow-sm flex items-center justify-between';
            listItem.innerHTML = `
                <span class="text-lg text-slate-700">${todoText}</span>
                <button class="delete-todo-btn text-red-500 hover:text-red-700 font-bold px-2">X</button>
            `;
            todoList.appendChild(listItem);
            todoInput.value = '';

            const deleteButton = listItem.querySelector('.delete-todo-btn');
            deleteButton.addEventListener('click', () => {
                listItem.remove();
            });
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

    document.querySelectorAll('.delete-todo-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('li').remove();
        });
    });

    // ----------------------------
    // Mesaj Kutusu Gönderim Logic
    // ----------------------------
    const messageForm = document.getElementById('messageForm');
    const messageStatus = document.getElementById('messageStatus');

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            messageStatus.classList.remove('hidden');
            messageForm.reset();
            setTimeout(() => {
                messageStatus.classList.add('hidden');
            }, 3000);
        });
    }
});