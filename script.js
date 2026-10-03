// ============================================================
// Younus Mashoor — portfolio
// Theme toggle, navigation, scroll reveal, collapsible sections.
// Theme is applied pre-paint by the inline script in <head>;
// this file only wires up the toggle.
// ============================================================

(function () {
    'use strict';

    var root = document.documentElement;
    var MOBILE_BREAKPOINT = 900;

    // --- Theme ------------------------------------------------

    var themeToggle = document.getElementById('themeToggle');

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (e) { /* storage blocked — theme still applies for this page view */ }
        if (themeToggle) {
            themeToggle.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
        }
    }

    if (themeToggle) {
        setTheme(currentTheme());
        themeToggle.addEventListener('click', function () {
            setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    // Follow the OS only while the visitor has made no explicit choice.
    if (window.matchMedia) {
        var scheme = window.matchMedia('(prefers-color-scheme: dark)');
        var onSchemeChange = function (e) {
            var stored = null;
            try { stored = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
            if (!stored) setTheme(e.matches ? 'dark' : 'light');
        };
        if (scheme.addEventListener) {
            scheme.addEventListener('change', onSchemeChange);
        } else if (scheme.addListener) {
            scheme.addListener(onSchemeChange);
        }
    }

    // --- Mobile navigation ------------------------------------

    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    function openMenu() {
        navLinks.classList.add('open');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        nav.classList.add('menu-open');
        document.body.classList.add('no-scroll');
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
    }

    if (navToggle && navLinks && nav) {
        navToggle.addEventListener('click', function () {
            if (navLinks.classList.contains('open')) closeMenu();
            else openMenu();
        });

        navLinks.addEventListener('click', function (e) {
            if (e.target.closest('.nav-link')) closeMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
                navToggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= MOBILE_BREAKPOINT) closeMenu();
        });
    }

    // --- Scrolled state + active link -------------------------

    var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
    var ticking = false;

    function updateOnScroll() {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);

        if (!sections.length) return;

        var current = sections[0].id;
        var atBottom = window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2;

        if (atBottom) {
            current = sections[sections.length - 1].id;
        } else {
            for (var i = 0; i < sections.length; i++) {
                if (sections[i].getBoundingClientRect().top <= 120) {
                    current = sections[i].id;
                }
            }
        }

        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateOnScroll();
            ticking = false;
        });
    }, { passive: true });

    updateOnScroll();

    // --- Scroll reveal ----------------------------------------

    var revealTargets = document.querySelectorAll('.fade-in, .stagger');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealTargets.forEach(function (el) { observer.observe(el); });
    } else {
        // No observer support — show everything rather than hide it.
        revealTargets.forEach(function (el) { el.classList.add('visible'); });
    }

    // --- Collapsible sections ---------------------------------

    function setupToggle(buttonId, targetId, expandedLabel, collapsedLabel) {
        var button = document.getElementById(buttonId);
        var target = document.getElementById(targetId);
        if (!button || !target) return;

        button.addEventListener('click', function () {
            var expanded = target.classList.toggle('visible');
            button.classList.toggle('expanded', expanded);
            button.setAttribute('aria-expanded', String(expanded));
            button.querySelector('span').textContent = expanded ? expandedLabel : collapsedLabel;

            if (expanded) {
                // Newly shown entries were never observed, so reveal them directly.
                target.classList.add('visible');
                Array.prototype.forEach.call(
                    target.querySelectorAll('.fade-in, .stagger'),
                    function (el) { el.classList.add('visible'); }
                );
            }
        });
    }

    setupToggle('toggleExperience', 'moreExperience', 'Hide earlier roles', 'Show earlier roles');
})();
