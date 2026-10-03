# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vanilla HTML/CSS/JavaScript single-page portfolio for Younus Mashoor, an Edge AI Systems
Engineer. No framework, no build system, no package manager. Deployed as static files on
GitHub Pages.

The branding here must stay in sync with the GitHub profile README in the parent directory:
same title ("Edge AI Systems Engineer"), same teal accent, and the same plain, concrete
prose voice. Avoid rhetorical flourishes — name hardware, techniques and measurements.

## Development

Open `index.html` directly in a browser or use any static file server
(e.g., `python3 -m http.server 8000`). No build step required.

There are no tests, linting, or CI/CD configured.

## Architecture

Four source files:

- **index.html** — Single page, seven numbered sections (`#home`, `#about`, `#stack`,
  `#experience`, `#projects`, `#certifications`, `#contact`). Icons are `<symbol>` elements
  in a hidden `<svg>` sprite at the top of `<body>`, referenced via `<use href="#i-name"/>`.
  An inline script in `<head>` applies the stored theme and adds `.js` to `<html>` before
  first paint. Contact form posts to Formspree.
- **styles.css** — Technical/datasheet system. Light theme on `:root`, dark theme under
  `[data-theme="dark"]`. All colour, spacing and type values are CSS custom properties.
  Mobile-first; breakpoints at 640/760/880/900/1024px. Respects `prefers-reduced-motion`
  and has a print stylesheet.
- **script.js** — IIFE, strict mode. Theme toggle, mobile nav, scrolled-state and
  active-link tracking, IntersectionObserver scroll reveal, collapsible "show earlier
  roles" toggle.
- **contact.js** — Formspree handler with localStorage rate limiting (max 3/hour, 1-min
  cooldown). Preserves the submit button's innerHTML across state transitions.

## Key Patterns

- **Design language**: hairline 1px rules instead of cards and shadows, square corners,
  monospace (JetBrains Mono) for all metadata — section labels, dates, stack values, form
  labels, buttons — and Inter for prose. One teal accent (`--accent`), used only for the
  section number, the role line, links on hover, and focus rings. Do not add gradients,
  glows, decorative background images or pill-shaped chips.
- **Theme**: applied pre-paint by the inline `<head>` script to avoid a flash. `script.js`
  only wires the toggle and follows the OS preference while no explicit choice is stored.
  Every `localStorage` access is wrapped in try/catch.
- **No-JS safety**: scroll-reveal rules are scoped to `.js .fade-in` / `.js .stagger > *`,
  so content is never hidden when JavaScript is unavailable.
- **Single source for nav links**: below 900px the `.nav-links` list itself becomes the
  full-screen menu panel. There is no duplicate mobile link list.
- **No duplication**: a technology appears in exactly one `.spec-row`. Check before adding.
- **Icon sprite**: add new icons as `<symbol id="i-name">` in the sprite block; never
  reintroduce a Font Awesome or other icon CDN.

## External Dependencies

Google Fonts only (Inter, JetBrains Mono). The page is otherwise self-contained.
`hero-bg.png` is retained in the repo but no longer referenced by any file.
