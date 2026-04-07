# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanilla HTML/CSS/JavaScript single-page portfolio website. No framework, no build system, no package manager. Deployed as static files on GitHub Pages.

## Development

Open `index.html` directly in a browser or use any static file server (e.g., `python3 -m http.server 8000`). No build step required.

There are no tests, linting, or CI/CD configured.

## Architecture

Four source files:

- **index.html** — Single-page layout with section-based navigation (#home, #about, #experience, #projects, #contact). SVG icon sprites defined in a hidden `<svg>` block and referenced via `<use href="#icon-name"/>`. Hero uses `data-tilt` attributes on elements for mouse-parallax depth values. Contact form posts to Formspree.
- **styles.css** — Dark theme (emerald accent `#10b981` on navy `#0a0f1c`). CSS custom properties for all colors/spacing/typography. Mobile-first responsive (breakpoints 640/768/1024px). Hero uses 3D perspective + transform-style preserve-3d for the parallax tilt. Scroll animations gated behind `.js` class on `<html>` to prevent FOUC. Respects `prefers-reduced-motion`.
- **script.js** — Navigation (sticky bg, active link tracking, mobile hamburger with overlay), typing effect that cycles through taglines in the hero, hero parallax tilt (mouse tracking with lerp smoothing, only on hover-capable devices), cursor glow, project card spotlight effect, fade-in/stagger scroll animations, and collapsible "show more" toggles.
- **contact.js** — Formspree contact form handler with localStorage-based rate limiting (max 3/hour, 1-min cooldown). Preserves button innerHTML so the submit button's SVG icon survives state transitions.

## Key Patterns

- **Parallax tilt**: `.hero-content` has `perspective` on the parent and `transform-style: preserve-3d`. On mousemove the container rotates by a few degrees, and each `[data-tilt]` element translates by its depth value — creating layered depth. Uses lerp (`currentX += (targetX - currentX) * 0.08`) for smooth easing and is disabled on touch devices via `matchMedia('(hover: none)')`.
- **Typing effect**: Cycles through an array of taglines via a recursive `setTimeout` loop with different speeds for type/delete/pause phases.
- **Icon sprites**: All reusable icons are `<symbol>` elements referenced with `<use href="#icon-name"/>`. Provider/brand icons (AWS, IBM, Microsoft) use Font Awesome from CDN.
- **Scroll animations**: Elements with `.fade-in` or `.stagger` classes are observed by IntersectionObserver. The `.js` class on `<html>` (set inline in `<head>`) ensures elements only hide when JS is available.
- **External dependencies** (CDN): Google Fonts (Space Grotesk), Font Awesome 6.5.1.
