# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Promotional single-page site for **IGS·中国（成都）国际数字娱乐博览会** (IGS China (Chengdu) International Digital Entertainment Expo) and its annual **IGS·全球数字文创发展大会** (Global Digital Cultural and Creative Development Conference). Content and copy are Simplified Chinese; keep new copy in Chinese to match. Built from the client's finished 17-page PDF design and their supplied photo/logo assets.

## Stack & structure

Static HTML/CSS/JS, no build step, no dependencies. Everything is one long page.

- `index.html` — all section markup. Sections are `<section id="…">` under `<main>`: 首页 (hero), 关于IGS (about), 本届规划 (this year's plan), 往届回顾 (past review), 联系我们 (contact). Section `id`s are the anchors the nav and scroll-spy depend on — keep them in sync with the `.nav-link` `data-section` attributes.
- `styles.css` — all styling. Design tokens live in the `:root` block at the top (blue/red/yellow brand palette, `--radius`, `--max-width`, `--sans` CJK-first font stack). Change colors/spacing there rather than hardcoding. Includes a `prefers-color-scheme: dark` override.
- `app.js` — one IIFE wiring up all interactivity, coupled to the markup by element IDs and data-attributes:
  - Mobile nav toggle (`#navToggle` / `#mainNav`, `is-open`)
  - Scroll-spy nav highlighting via `IntersectionObserver` over `main > section[id]`, toggling `is-active` on the matching `.nav-link`
  - A generic `initCarousel(root, dotsContainer)` used twice — About (`#aboutCarousel`/`#aboutDots`) and Past-review years (`#historyCarousel`/`#historyDots`); slides are `.carousel-slide`, arrows are `.carousel-arrow` with `data-carousel` ("about"/other) and `data-dir` ("1" = next)
  - History tabs (`#historyTabs .tab` ↔ `.tab-panel[data-tab-panel]` via `data-tab`)
- `images/` — curated photos and logos sourced from the client's asset folder.

## Develop

Serve locally (no build):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Conventions

- Active/open states are driven by the `is-active` / `is-open` classes toggled in `app.js` — style state through those classes, not inline styles.
- When adding a section, add its `id`, a matching `.nav-link` with `data-section`, and it is picked up by scroll-spy automatically.
- Adding a carousel or tab group means reusing the existing `initCarousel` / tab wiring and matching the ID/data-attribute contract above.

---

# Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Match the reference exactly; do not improve or add to the design.

## Local Server
- **Always serve on localhost** – never load a `file:///` URL.
- Start the dev server from the project root: `python3 -m http.server 8000` (serves at `http://localhost:8000`).
- Start it in the background.
- If the server is already running, do not start a second instance.

## Output Defaults
- This project is hand-written HTML/CSS/JS — **not** Tailwind and **not** a single inline file. Match the existing structure: markup in `index.html`, styles in `styles.css`, behavior in `app.js`.
- Reuse the design tokens in the `styles.css` `:root` block; do not hardcode colors/spacing or invent a new palette.
- Chinese-language copy; use `images/` for real assets and `https://placehold.co/WIDTHxHEIGHT` only for genuine placeholders.
- Mobile-first responsive; a `prefers-color-scheme: dark` override already exists in `styles.css` — extend it, don't bypass it.

## Anti-Generic Guardrails
- **Colors:** Derive from the brand palette in the `styles.css` `:root` block (blue/red/yellow). Never introduce a stock/default framework palette.
- **Shadows:** Never use flat, single-layer shadows. Use layered, color-tinted shadows with low opacity (see `--shadow`).
- **Typography:** Don't reuse one font for headings and body. Pair a display face with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition: all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay and a color treatment layer (e.g. `mix-blend-multiply`) rather than bare `<img>`.
- **Spacing:** Use intentional, consistent spacing tokens – not arbitrary one-off values.
- **Depth:** Surfaces should have a layering system (base -> elevated -> floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design – match it
- Do not use `transition: all`
- Do not introduce a stock/default framework color as the primary color
