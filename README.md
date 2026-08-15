# Faris Venture

Website for Faris Venture — a founder-backed halal investment venture deploying capital into vetted Bangladeshi SMEs through Shariah-compliant structures (Musharaka, Mudaraba, Murabaha).

Static single-page site, no build step. Bilingual (English default / Bangla toggle).

## Structure

- `index.html` — the entire site (markup, styles, and routing/i18n JS inline)
- `assets/Logo.png` — brand logo

## Local preview

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy

Static files only — upload `index.html` and `assets/` to any static host or the web root of your VPS (e.g. Hostinger, Nginx/Apache document root).

## To do

- [ ] Swap placeholder deal names in the Portfolio section once finalized
- [ ] Replace hero/about/portfolio image placeholders with real photos
- [ ] Wire the proposal form to a real backend or form service (currently front-end only)
