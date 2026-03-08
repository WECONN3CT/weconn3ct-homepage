/**
 * WECONN3CT - Main JavaScript
 */

(function() {
    'use strict';

    // ================================
    // Lenis Smooth Scroll
    // ================================
    let lenis = null;

    function initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis not loaded');
            return;
        }

        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // ================================
    // DOM Elements
    // ================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    const themeToggle = document.getElementById('themeToggle');

    // ================================
    // Navbar Scroll Effect
    // ================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ================================
    // Theme Toggle (Dark/Light Mode) - iPhone Style Checkbox
    // ================================
    function initThemeToggle() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Sync checkbox state with current theme
        if (themeToggle) {
            themeToggle.checked = isDark;
            themeToggle.addEventListener('change', toggleTheme);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                if (themeToggle) {
                    themeToggle.checked = e.matches;
                }
            }
        });
    }

    function toggleTheme() {
        const isDark = themeToggle.checked;
        const newTheme = isDark ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // ================================
    // Mobile Menu Toggle
    // ================================
    function toggleMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');

            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('svg');
                if (mobileMenu.classList.contains('open')) {
                    icon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    `;
                } else {
                    icon.innerHTML = `
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    `;
                }
            }
        }
    }

    // Toggle for new WECONN3CT style navbar
    function toggleNavbarMenu() {
        if (navbarMenu) {
            navbarMenu.classList.toggle('active');
        }
    }

    function closeMobileMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('open');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                `;
            }
        }
        if (navbarMenu) {
            navbarMenu.classList.remove('active');
        }
    }

    // ================================
    // Scroll Animations (Framer Motion Style)
    // Viewport: once: true, margin: "-50px"
    // Transition: duration: 0.6s, ease: "easeOut"
    // ================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);

                    // Once: true - unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ================================
    // Smooth Scroll for Anchor Links (with Lenis)
    // ================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();

                const target = document.querySelector(href);
                if (target) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;

                    // Use Lenis if available, otherwise fallback
                    if (lenis) {
                        lenis.scrollTo(target, {
                            offset: -navbarHeight,
                            duration: 1.2
                        });
                    } else {
                        const targetPosition = target.offsetTop - navbarHeight;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }

                    closeMobileMenu();
                }
            });
        });
    }

    // ================================
    // Rotating Word Animation
    // ================================
    function initRotatingWord() {
        const rotatingWord = document.getElementById('rotating-word');
        if (!rotatingWord) return;

        const words = [
            'Kreative',
            'Entwickler',
            'Designer',
            'Strategen',
            'Innovatoren',
            'Problemlöser',
            'Visionäre',
            'WECONN3CT'
        ];

        let currentIndex = 0;

        function rotateWord() {
            // Exit animation
            rotatingWord.classList.add('exit');

            setTimeout(() => {
                // Update word
                currentIndex = (currentIndex + 1) % words.length;
                rotatingWord.textContent = words[currentIndex];

                // Apply color class
                rotatingWord.className = 'font-extrabold word-color-' + currentIndex;

                // Enter animation
                rotatingWord.classList.add('enter');

                setTimeout(() => {
                    rotatingWord.classList.remove('enter');
                }, 50);
            }, 500);
        }

        // Start rotation
        setInterval(rotateWord, 2500);
    }

    // ================================
    // Active Navigation State
    // ================================
    function initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('text-white');
                    link.classList.remove('text-slate-400');
                } else {
                    link.classList.remove('text-white');
                    link.classList.add('text-slate-400');
                }
            });
        });
    }

    // ================================
    // Throttle Function
    // ================================
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ================================
    // Initialize
    // ================================
    function init() {
        // Event Listeners
        window.addEventListener('scroll', throttle(handleNavbarScroll, 10));

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }

        // New WECONN3CT style navbar toggle
        if (navbarToggle) {
            navbarToggle.addEventListener('click', toggleNavbarMenu);
        }

        if (mobileMenu) {
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        if (navbarMenu) {
            navbarMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }

        // Initialize features
        initLenis();
        initThemeToggle();
        initScrollAnimations();
        initSmoothScroll();
        initActiveNavigation();
        initRotatingWord();

        console.log('WECONN3CT static site initialized');
    }

    // ================================
    // Run on DOM Ready
    // ================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
