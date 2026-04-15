// ============================================================
// Portfolio — Younus Mashoor (Nike Podium CDS Inspired)
// Navigation, scroll animations
// ============================================================

// --- Theme Toggle -----------------------------------------
const themeToggle = document.getElementById('themeToggle');
const rootEl = document.documentElement;

function setTheme(theme) {
    if (theme === 'dark') {
        rootEl.setAttribute('data-theme', 'dark');
    } else {
        rootEl.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-label',
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
}

if (themeToggle) {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initial theme
    if (stored === 'dark' || (!stored && prefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    themeToggle.addEventListener('click', () => {
        const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
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
            nav.classList.toggle('scrolled', window.scrollY > 0);
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
    const atBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2;
    if (atBottom && sections.length) {
        current = sections[sections.length - 1].id;
    } else {
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                current = section.id;
            }
        });
    }
    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateActiveLink);
});

// Mobile menu
const navActions = document.querySelector('.nav-actions');

function openMenu() {
    navLinks.classList.remove('closing');
    navLinks.classList.add('open');
    if (navToggle) {
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
    }
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
    if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    nav.classList.remove('menu-open');
    document.body.classList.remove('no-scroll');
    
    if (overlay) {
        overlay.classList.add('closing');
    }

    setTimeout(() => {
        if (!navLinks.classList.contains('open')) {
            navLinks.classList.remove('closing');
            if (navActions && navActions.parentNode && navLinks.parentNode !== navActions.parentNode) {
                navActions.parentNode.insertBefore(navLinks, navActions);
            }
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
        }
    }, 300);
}

if (navToggle) {
    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && navLinks.classList.contains('open')) {
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
