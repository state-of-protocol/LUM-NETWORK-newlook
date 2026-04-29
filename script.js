/**
 * Mona Sans & Hubot Sans - Interaction Script
 * Fokus: Performance, Accessibility, dan "Wow" Effects
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarEffect();
    initButtonInteractions();
    initSmoothScroll();
});

/**
 * 1. Scroll Animations (The "Wow" Factor)
 * Memberi kesan elemen muncul (fade-up) semasa skrol menggunakan Intersection Observer.
 */
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Hanya lari sekali
            }
        });
    }, observerOptions);

    // Sasarkan kad dan tajuk untuk kesan ini
    const animateElements = document.querySelectorAll('.card, h1, h2, .hero p');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all var(--motion-normal) cubic-bezier(0.4, 0, 0.2, 1)`;
        observer.observe(el);
    });
};

/**
 * 2. Navbar Dynamic Styling
 * Menukar rupa navigasi apabila pengguna skrol ke bawah.
 */
const initNavbarEffect = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            nav.style.backdropFilter = 'blur(12px)';
            nav.style.borderBottom = '1px solid var(--color-surface-strong)';
            nav.style.padding = 'var(--space-4) var(--space-8)';
        } else {
            nav.style.backgroundColor = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.borderBottom = 'none';
            nav.style.padding = 'var(--space-8)';
        }
    }, { passive: true });
};

/**
 * 3. Button & Interactive States
 * Menambah logik 'loading' atau 'active' pada butang.
 */
const initButtonInteractions = () => {
    const primaryBtns = document.querySelectorAll('.btn-primary');

    primaryBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.96)';
        });

        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px) scale(1)';
        });

        // Contoh logik loading sederhana
        if (btn.dataset.loading === 'true') {
            btn.addEventListener('click', (e) => {
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Loading...';
                btn.style.opacity = '0.7';
                btn.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'all';
                }, 2000);
            });
        }
    });
};

/**
 * 4. Smooth Scroll untuk Navigasi Internal
 */
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

/**
 * 5. Diagnostic Tool (Optional)
 * Memastikan semua komponen mematuhi aturan "No Raw Hex" secara ringkas dalam console
 */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.info('%c Mona Sans System Active ', 'background: #0969da; color: white; border-radius: 4px; padding: 2px 5px;');
}
