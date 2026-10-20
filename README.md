# Alayam — Agal Vilakku

Storefront for handcrafted Agal Vilakku (traditional Tamil lamps). Bilingual (English / தமிழ்), with a 3D animated lamp, a wooden-door intro, a cart, and checkout that sends the order to WhatsApp.

## Run it

```bash
npm install
npm run dev        # development server
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
```

## Project layout

```
public/
  images/wooden-door.webp         intro door (already colour-graded)
  images/products/*.webp          product photos
src/
  components/
    3d/          DiyaScene (canvas + controls), DiyaLamp (lamp model, flame, embers)
    layout/      Header, Footer
    sections/    Home page sections (Hero, Featured, Categories, Heritage + About, Why, Festivals, FAQ, CTA)
    ui/          LoadingScreen (door intro), ProductCard, QuantitySelector, Notification, GoToTop
  data/          products.js, productTranslations.js
  pages/         Home, Products, ProductDetail, Cart, Checkout
  store/         cartStore (persisted), uiStore (intro / menu / toast), LanguageContext (EN/TA text)
  styles/        index.css — design tokens + shared classes
  utils/         productImages.js — product id -> image
  config.js      WhatsApp business number
```

## Things you will likely edit

| What | Where |
|------|-------|
| WhatsApp number | `src/config.js` |
| Add / change a product | `src/data/products.js`, Tamil text in `src/data/productTranslations.js`, photo in `public/images/products/` + `src/utils/productImages.js` |
| Site text (English / Tamil) | `src/store/LanguageContext.jsx` |
| Space between home sections | `--section-padding` in `src/styles/index.css` |
| Door intro timing | `TIMINGS` in `src/components/ui/LoadingScreen.jsx` |
| Lamp size / glide speed during the intro | `CENTER_SCALE`, `GLIDE_HOME` in `src/components/sections/HeroSection.jsx` |
| Blur strength during the intro | `blur(14px)` in `src/pages/Home.css` |

## Notes

- **Images** are WebP. If you replace `wooden-door.webp`, grade it to the same dark bronze tone first — the overlay in `LoadingScreen.css` assumes it.
- **Deploying:** `vercel.json` (Vercel) and `public/_redirects` (Netlify) both make direct links like `/cart` work.
- Checkout is frontend-only: it opens WhatsApp with the order message; no payment is processed.

## Stack

React 19 · Vite · React Router · Zustand · Framer Motion · Three.js with React Three Fiber

## Product gallery & size charts

Every product page has a swipeable gallery (swipe / arrows / dots / thumbnails).
The first picture is the normal product photo; extra pictures come from `src/assets/size-charts/`:

- `<product-slug>.webp` – the size-chart image (2nd picture)
- `<product-slug>--2.webp`, `--3.webp` … – optional extra pictures

`.webp`, `.png`, `.jpg`, `.jpeg` and `.avif` all work. New products need no code change: add the
product to `src/data/products.js`, drop an image named after its slug, redeploy.
Products with no extra image look exactly as before.

To generate charts in the site style, set each product's real size in `tools/size-charts.json`
and run `python3 tools/make-size-chart.py` (needs `pip install pillow numpy`).

## Motion effects

- **Cursor:** `src/components/ui/SplashCursor.jsx` – ReactBits Splash Cursor (WebGL fluid), gold-tinted. Pass `HUE_RANGE={null}` in `App.jsx` for the original rainbow colours.
- **Nav bar:** `src/components/ui/GooeyNav.jsx` – ReactBits Gooey Nav; the blob and bubbles play whenever the page changes.
- **Scroll:** `ScrollProgress` (gold bar at the top), `ScrollReveal` (words sharpen as you scroll; used in Heritage and the final call-to-action) and a parallax lamp in the Heritage section. All respect "reduce motion".

## About / Certifications / Gallery pages

- `src/pages/About.jsx` – About Us text (English + Tamil headings) lives at the top of the file.
- `src/pages/Certifications.jsx` – certificate cards; PDFs and preview images are in `public/certificates/`. To replace a certificate, overwrite the PDF and regenerate its `*-preview.webp`.
- `src/pages/Gallery.jsx` – shows every product photo plus anything you drop into `src/assets/gallery/` (no code change needed).
- Header logo: `public/images/logo-emblem.webp` with "Since 2002" underneath (`Header.jsx` / `Header.css`).
