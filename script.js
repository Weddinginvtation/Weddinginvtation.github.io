document.addEventListener('DOMContentLoaded', () => {

    // 1. Audio and Intro Loading
    const openBtn = document.getElementById('open-btn');
    const overlay = document.getElementById('welcome-overlay');
    const mainContent = document.getElementById('main-content');

    // Audio Context Setup
    const bgMusic = document.getElementById('bg-music');
    const fireworkAudio = document.getElementById('firework-audio');

    // Trigger on "Begin Journey"
    openBtn.addEventListener('click', () => {
        // Unmute and play background music
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => console.log('Audio autoplay blocked', e));
        }

        // Initialize firework audio context properly for mobile/Safari
        if (fireworkAudio) {
            // Mute before play-pause to avoid hearing an initial pop
            fireworkAudio.volume = 0;
            fireworkAudio.play().then(() => {
                fireworkAudio.pause();
                fireworkAudio.currentTime = 0;
                fireworkAudio.volume = 1.0; // Restore volume for the actual explosion
            }).catch(e => console.log('Secondary audio blocked', e));
        }

        // Dissolve overlay
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
            mainContent.classList.remove('hidden');

            // Re-trigger visual animations on hero elements
            const fadeUps = document.querySelectorAll('.hero .fade-up');
            fadeUps.forEach(el => el.classList.add('reveal', 'active'));
        }, 1200);
    });

    // 2. Global Scroll Animation
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .fade-up').forEach(el => revealObserver.observe(el));


    // 3. Swiper Carousel removed.
    
    // 4. Auto-Surprise (Fireworks & Balloons) triggered by Scroll
    const surpriseSection = document.getElementById('auto-surprise');
    const animLayer = document.getElementById('animation-layer');
    let hasCelebrated = false;

    const surpriseObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.6 // Trigger when 60% of the cake section is visible
    };

    const surpriseObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasCelebrated) {
            hasCelebrated = true; // prevent re-triggering

            // Play Audio
            if (fireworkAudio) {
                fireworkAudio.currentTime = 0;
                fireworkAudio.play().catch(e => console.log(e));
            }

            // Trigger visual effects
            createBalloons();
            sparkFlares();
        }
    }, surpriseObserverOptions);

    if (surpriseSection) {
        surpriseObserver.observe(surpriseSection);
    }

    function createBalloons() {
        const colors = ['#dfb160', '#f5d18d', '#ffffff', '#b5934f'];

        for (let i = 0; i < 25; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');

            const delay = Math.random() * 1.5;
            const right = Math.random() * 100; // Using right for RTL safety
            const sizeMap = Math.random() * 0.5 + 0.8;
            const color = colors[Math.floor(Math.random() * colors.length)];

            balloon.style.right = `${right}%`;
            balloon.style.background = color;
            balloon.style.transform = `scale(${sizeMap})`;
            balloon.style.animationDelay = `${delay}s`;

            animLayer.appendChild(balloon);
            setTimeout(() => balloon.remove(), (5 + delay) * 1000);
        }
    }

    function sparkFlares() {
        for (let i = 0; i < 60; i++) {
            const flare = document.createElement('div');
            flare.classList.add('flare');

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * window.innerWidth * 0.4;

            // Use negative/positive x because RTL center transform is flipped
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            flare.style.setProperty('--dx', `${dx}px`);
            flare.style.setProperty('--dy', `${dy}px`);

            // Start exactly in the center
            flare.style.right = '50%';
            flare.style.top = '50%';

            const delay = Math.random() * 1.5;
            flare.style.animationDelay = `${delay}s`;

            animLayer.appendChild(flare);
            setTimeout(() => flare.remove(), (2 + delay) * 1000);
        }
    }

});
