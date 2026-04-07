// ============================================================
// Portfolio — Younus Mashoor
// Navigation, typing effect, parallax tilt, scroll animations
// ============================================================

// --- Theme toggle -----------------------------------------

const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function setTheme(theme) {
    if (theme === 'light') {
        rootEl.setAttribute('data-theme', 'light');
    } else {
        rootEl.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-label',
            theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
}

if (themeToggle) {
    const initial = rootEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label',
        initial === 'light' ? 'Switch to dark theme' : 'Switch to light theme');

    themeToggle.addEventListener('click', () => {
        const current = rootEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        setTheme(current === 'light' ? 'dark' : 'light');
    });
}

// --- Navigation -------------------------------------------

const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
let overlay = null;

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
            ticking = false;
        });
        ticking = true;
    }
});

// Active link tracking
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.id;
        }
    });
    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});

// Mobile menu
// navLinks is moved to <body> when the menu opens so it escapes the
// nav's stacking-context and backdrop-filter containing block.
const navActions = document.querySelector('.nav-actions');

function openMenu() {
    navLinks.classList.remove('closing');
    navLinks.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('menu-open');
    document.body.classList.add('no-scroll');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.addEventListener('click', closeMenu);
        document.body.appendChild(overlay);
    }
    overlay.classList.remove('closing');

    if (navLinks.parentNode !== document.body) {
        document.body.appendChild(navLinks);
    }
}

function closeMenu() {
    if (!navLinks.classList.contains('open')) return;

    navLinks.classList.remove('open');
    navLinks.classList.add('closing');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    
    if (overlay) {
        overlay.classList.add('closing');
    }

    setTimeout(() => {
        if (!navLinks.classList.contains('open')) {
            navLinks.classList.remove('closing');
            if (navActions.parentNode && navLinks.parentNode !== navActions.parentNode) {
                navActions.parentNode.insertBefore(navLinks, navActions);
            }
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
        }
    }, 300);
}

navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
        closeMenu();
    } else {
        openMenu();
    }
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        closeMenu();
    }
});

// --- Smooth scrolling -------------------------------------

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Typing effect ----------------------------------------

const typedEl = document.getElementById('typedText');
if (typedEl) {
    const phrases = [
        'Building production-grade AI & data systems.',
        'Scaling ML from notebook to cloud.',
        'Architecting pipelines for petabyte-scale data.',
        'Shipping code that thinks.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, 28);
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(tick, 2200);
                return;
            }
            setTimeout(tick, 55);
        }
    }
    setTimeout(tick, 800);
}

// --- Hero parallax tilt (mouse tracking) ------------------

const hero = document.querySelector('.hero');
const heroContent = document.getElementById('heroContent');
const cursorGlow = document.getElementById('cursorGlow');
const tiltTargets = document.querySelectorAll('[data-tilt]');

if (hero && heroContent && !window.matchMedia('(hover: none)').matches) {
    let rafPending = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize to -1..1
        targetX = (x / rect.width) * 2 - 1;
        targetY = (y / rect.height) * 2 - 1;

        // Move cursor glow
        if (cursorGlow) {
            cursorGlow.style.left = x + 'px';
            cursorGlow.style.top = y + 'px';
        }

        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(animateTilt);
        }
    });

    hero.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(animateTilt);
        }
    });

    function animateTilt() {
        // Smooth interpolation (lerp)
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        // Container-level tilt
        const rotateY = currentX * 6;
        const rotateX = -currentY * 6;
        heroContent.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Per-element depth shift (parallax)
        tiltTargets.forEach(el => {
            const depth = parseFloat(el.dataset.tilt) || 0;
            const tx = currentX * depth;
            const ty = currentY * depth;
            el.style.transform = `translate3d(${tx}px, ${ty}px, ${depth * 2}px)`;
        });

        // Continue animating if still interpolating
        if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
            requestAnimationFrame(animateTilt);
        } else {
            rafPending = false;
        }
    }
}

// --- Project card cursor glow -----------------------------

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
    });
});

// --- Fade-in on scroll ------------------------------------

const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in, .stagger').forEach(el => {
    fadeObserver.observe(el);
});

// --- Toggle sections --------------------------------------

function setupToggle(buttonId, targetId, labelExpanded, labelCollapsed) {
    const button = document.getElementById(buttonId);
    const target = document.getElementById(targetId);
    if (!button || !target) return;

    button.addEventListener('click', () => {
        const isExpanded = target.classList.toggle('visible');
        button.classList.toggle('expanded', isExpanded);
        button.setAttribute('aria-expanded', isExpanded);
        button.querySelector('span').textContent = isExpanded ? labelExpanded : labelCollapsed;
    });
}

setupToggle('toggleExperience', 'moreExperience', 'Show less', 'Show more');
setupToggle('toggleProjects', 'moreProjects', 'Show fewer projects', 'View all projects');
