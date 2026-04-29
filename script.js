/**
 * Lum Network Reimagined 2026
 * Core Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
    LumSystem.init();
});

const LumSystem = {
    init() {
        this.navbar();
        this.scrollAnimations();
        this.counters();
        this.smoothScroll();
        this.buttonInteractions();
        this.heroParallax();
        this.diagnostic();
    },

    /**
     * 1. Navbar Logic
     * Menukar gaya navbar apabila skrol dan menguruskan ketelusan.
     */
    navbar() {
        const nav = document.querySelector('.navbar');
        if (!nav) return;

        const handleScroll = () => {
            if (window.scrollY > 20) {
                nav.classList.add('navbar--scrolled');
            } else {
                nav.classList.remove('navbar--scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * 2. Scroll Reveal (Intersection Observer)
     * Mencetuskan animasi '.reveal' apabila elemen masuk ke viewport.
     */
    scrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Jika elemen adalah stat (nombor), mulakan counter
                    if (entry.target.classList.contains('stat-item')) {
                        this.animateNumber(entry.target.querySelector('span'));
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, .stat-item, .card').forEach(el => {
            observer.observe(el);
        });
    },

    /**
     * 3. Statistics Counter
     * Menghidupkan nombor pada bahagian "Lum Network In Numbers"
     */
    animateNumber(el) {
        if (!el || el.innerText === '-') {
            // Simulasi data jika nilai asal adalah '-'
            const targetValues = {
                'Market Cap': 12500000,
                'Transactions': 845200,
                'Blocks': 12405060,
                'Block Time': 5.8,
                '$LUM Staking APR': 14.2
            };

            const label = el.nextElementSibling.innerText;
            const target = targetValues[label] || 100;
            let start = 0;
            const duration = 2000; // 2 saat
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out function
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = start + (target - start) * easeOut;

                if (label.includes('APR') || label.includes('Time')) {
                    el.innerText = current.toFixed(1) + (label.includes('APR') ? '%' : 's');
                } else {
                    el.innerText = Math.floor(current).toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        }
    },

    /**
     * 4. Hero Parallax Effect
     * Memberikan pergerakan halus pada sfera biru apabila tetikus bergerak.
     */
    heroParallax() {
        const sphere = document.querySelector('.sphere-glow');
        if (!sphere) return;

        window.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
            sphere.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    },

    /**
     * 5. Button Micro-interactions
     */
    buttonInteractions() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.classList.add('btn--pressed');
            });
            
            btn.addEventListener('mouseup', () => {
                btn.classList.remove('btn--pressed');
            });

            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('btn--pressed');
            });
        });
    },

    /**
     * 6. Smooth Scroll Logic
     */
    smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    },

    /**
     * Diagnostic Tool
     */
    diagnostic() {
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log(
                '%c LUM NETWORK SYSTEM ACTIVE %c Loaded with Mona Sans ',
                'background: #0969da; color: white; font-weight: bold; padding: 4px; border-radius: 4px 0 0 4px;',
                'background: #1f2328; color: #9198a1; padding: 4px; border-radius: 0 4px 4px 0;'
            );
        }
    }
};
