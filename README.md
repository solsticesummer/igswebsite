# IGS 官网

Promotional website for **IGS·中国（成都）国际数字娱乐博览会** (IGS China (Chengdu) International Digital Entertainment Expo) and its annual **IGS·全球数字文创发展大会** (IGS Global Digital Cultural and Creative Development Conference).

Built from the client's finished PDF design (17 pages / one long single-page site) and their supplied photo/logo assets.

## Sections

- **首页** — hero with event dates and CTA
- **关于IGS** — 4-slide carousel: expo overview + stats, national conference, expo photos, past partners
- **本届规划** — this year's schedule, venue map, and logistics
- **往届回顾** — past-year highlights carousel (2018–2026) and a past-guests tab
- **联系我们** — contact details and WeChat QR

## Tech Stack

Static HTML/CSS/JS, no build step, no dependencies.

- `index.html` — all section markup
- `styles.css` — design tokens (colors, spacing, typography) live in the `:root` block; includes a `prefers-color-scheme: dark` override
- `app.js` — scroll-spy nav highlighting, the two carousels (About / Past-review years), the past-review tab switch, and the mobile nav toggle
- `images/` — curated photos and logos sourced from the client's asset folder

## Develop

Serve locally (no build):

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
