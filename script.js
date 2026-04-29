/**
 * Lum Network Reimagined - Interaction Script
 * Fokus: Clean Logic, Class-based States, Performance
 */

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan komponen secara modular
    LumNetwork.initScrollAnimations();
    LumNetwork.initNavbarEffect();
    LumNetwork.initButtonInteractions();
    LumNetwork.initSmoothScroll();
});

const LumNetwork = {
    /**
     * 1. Scroll Animations (Intersection Observer)
     * Menggunakan class .is-visible untuk memicu animasi CSS
     */
    initScrollAnimations: () => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elemen yang akan di-animasikan
        const animateElements = document.querySelectorAll('.card, h1, h2, .badge, .hero-subtitle');
        
        animateElements.forEach(el => {
            // Kita tambah class awal melalui JS jika tidak mahu ganggu HTML asal
            el.classList.add('reveal'); 
            observer.observe(el);
        });
    },

    /**
     * 2. Navbar Dynamic Styling
     * Menggunakan class .navbar--scrolled untuk perubahan gaya
     */
    initNavbarEffect: () => {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        const handleScroll = () => {
            // Guna classList.toggle untuk logik yang lebih bersih
            const isScrolled = window.scrollY > 50;
            nav.classList.toggle('navbar--scrolled', isScrolled);
        };

        // Guna throttle atau passive listener untuk prestasi skrol
        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * 3. Button Micro-interactions
     * Menguruskan state aktif dan loading
     */
    initButtonInteractions: () => {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(btn => {
            // Kesan klik (active state)
            btn.addEventListener('mousedown', () => btn.classList.add('btn--pressed'));
            btn.addEventListener('mouseup', () => btn.classList.remove('btn--pressed'));
            btn.addEventListener('mouseleave', () => btn.classList.remove('btn--pressed'));

            // Logik Loading jika data-btn-loading wujud
            if (btn.hasAttribute('data-btn-loading')) {
                btn.addEventListener('click', function(e) {
                    const self = this;
                    const originalContent = self.innerHTML;
                    
                    self.classList.add('btn--loading');
                    self.style.pointerEvents = 'none';
                    self.innerHTML = `<span class="spinner"></span> Loading...`;
                    
                    // Simulasi API call/proses
                    setTimeout(() => {
                        self.classList.remove('btn--loading');
                        self.style.pointerEvents = 'all';
                        self.innerHTML = originalContent;
                    }, 2000);
                });
            }
        });
    },

    /**
     * 4. Smooth Scroll
     */
    initSmoothScroll: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

/**
 * Diagnostic Tool
 */
if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    console.log('%c LUM NETWORK SYSTEM ACTIVE ', 'background: #0969da; color: white; font-weight: bold; padding: 4px;');
}
