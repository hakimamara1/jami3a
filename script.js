import { inject, track } from '@vercel/analytics';
inject();

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.replace('fa-bars', 'fa-times');
        } else {
            menuIcon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.replace('fa-times', 'fa-bars');
        });
    });

    // 4. Navbar Scroll Effect & Active Link Highlight
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 5. Code Snippet Toggle
    const toggleBtns = document.querySelectorAll('.toggle-code-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const codeSnippet = this.nextElementSibling;
            const icon = this.querySelector('i');

            codeSnippet.classList.toggle('show');

            if (codeSnippet.classList.contains('show')) {
                icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                this.innerHTML = `إخفاء الشفرة <i class="fas fa-chevron-up"></i>`;
            } else {
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                this.innerHTML = `عرض الشفرة <i class="fas fa-chevron-down"></i>`;
            }
        });
    });

    // 6. Evaluation Simulator Logic
    const evaluateBtn = document.getElementById('evaluate-btn');
    const gradeInput = document.getElementById('grade-input');
    const gradeValue = document.getElementById('grade-value');
    const evalResult = document.getElementById('eval-result');
    const evalEmoji = document.getElementById('eval-emoji');
    const evalText = document.getElementById('eval-text');

    // Update range value text
    if (gradeInput && gradeValue) {
        gradeInput.addEventListener('input', (e) => {
            gradeValue.textContent = e.target.value;
        });
    }

    evaluateBtn.addEventListener('click', evaluateGrade);

    function evaluateGrade() {
        const value = parseFloat(gradeInput.value);

        // Track the click event with Vercel Analytics
        track('evaluate_click', { grade: value });

        // Hide result to reset animation
        evalResult.classList.add('hidden');
        evalEmoji.classList.remove('animate');

        // Small delay to allow the CSS transition to reset
        setTimeout(() => {
            if (isNaN(value) || value < 0 || value > 20) {
                evalEmoji.textContent = '🤔';
                evalText.textContent = 'الرجاء إدخال درجة صحيحة (0-20)';
                evalText.style.color = 'var(--text-color)';
            } else if (value >= 0 && value < 10) {
                evalEmoji.textContent = '😡';
                evalText.textContent = 'الظلم ظلومات يوم القيامة';
                evalText.style.color = '#ef4444'; // Red
            } else if (value >= 10 && value < 17) {
                evalEmoji.textContent = '😐';
                evalText.textContent = 'او علبالي بلي راكي ناس ملاح استاذة زيدي شوي برك الاستاذ شبوط مدلي 1,5 في TD  ';
                evalText.style.color = '#f59e0b'; // Yellow/Orange
            } else if (value >= 17 && value <= 20) {
                evalEmoji.textContent = '🙂';
                evalText.textContent = 'شكرا لكي يا افضل استاذة(';
                evalText.style.color = '#10b981'; // Green
            }

            // Show result and trigger animation
            evalResult.classList.remove('hidden');
            evalEmoji.classList.add('animate');
        }, 300);
    }

    // 7. Scroll Animation using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    // Apply observer to elements we want to animate
    document.querySelectorAll('.project-card, .evaluator-card, .about-content, .about-tech').forEach(el => {
        el.classList.add('scroll-animate');
        scrollObserver.observe(el);
    });
});
