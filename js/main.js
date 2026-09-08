/* ============================================================
   Portfólio — Maria Eduarda Batista
   Interações: campo de estrelas, digitação, menu mobile e scroll
   ============================================================ */

(() => {
    'use strict';

    /* ---------- Campo de estrelas (canvas) ---------- */
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        const count = Math.min(140, Math.floor(window.innerWidth / 9));
        stars = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.2,
            a: Math.random() * 0.6 + 0.3,
            vy: Math.random() * 0.12 + 0.02,
        }));
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const s of stars) {
            s.y += s.vy;
            if (s.y > canvas.height) {
                s.y = -2;
                s.x = Math.random() * canvas.width;
            }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 226, 255, ${s.a})`;
            ctx.fill();
        }
        requestAnimationFrame(drawStars);
    }

    let starsInitialized = false;
    function initStars() {
        if (starsInitialized) return;
        starsInitialized = true;
        resizeCanvas();
        createStars();
        drawStars();
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
    });

    /* Inicia quando o documento estiver pronto (canvas pode estar visível) */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStars);
    } else {
        initStars();
    }

    /* ---------- Efeito de digitação no hero ---------- */
    const phrases = [
        'Estudante de Engenharia de Computação',
        'Sistemas Embarcados',
        'Visão Computacional',
        'IoT Industrial',
    ];
    const el = document.getElementById('typewriter');
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
        if (!el) return;
        const current = phrases[phraseIdx];
        if (!deleting) {
            charIdx++;
            el.textContent = current.slice(0, charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
            setTimeout(type, 55);
        } else {
            charIdx--;
            el.textContent = current.slice(0, charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 30);
        }
    }
    type();

    /* ---------- Cabeçalho com sombra ao rolar ---------- */
    const header = document.getElementById('header');
    function onScrollHeader() {
        header.classList.toggle('scrolled', window.scrollY > 12);
    }
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Menu mobile ---------- */
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('nav-menu');

    function toggleMenu(forceClose) {
        const isOpen = forceClose ? false : menu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen === undefined ? !menu.classList.contains('open') : isOpen);
        hamburger.setAttribute('aria-expanded', String(menu.classList.contains('open')));
        document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggleMenu());

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (menu.classList.contains('open')) toggleMenu(true);
        });
    });

    /* ---------- Link ativo da navegação ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    /* ---------- Revelação ao rolar (IntersectionObserver) ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
})();
