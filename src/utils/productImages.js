// Product image lookup.
// Photos live in public/images/products/. Products without a photo show a blank slot.

const PHOTOS = {
  1: 'colour-pot-clay-vilakku',
  2: 'diwali-diya-on-woven-jute-mat',
  3: 'festive-alayam-diya-gift-box',
  4: 'festive-alayam-pooja-oil-gift-set',
  5: 'festive-diwali-diyas-in-golden-glow',
  6: 'festive-diwali-diyas-with-jasmine-and-gold',
  7: 'festive-glow-of-four-colourful-diyas',
  8: 'festive-terracotta-diya-still-life',
  9: 'festive-terracotta-diya-on-jute-mat',
  10: 'festive-terracotta-diya-with-jasmine-and-golden-light',
  11: 'festive-terracotta-lotus-diya-on-jute',
  12: 'festive-terracotta-star-diya',
  13: 'golden-diwali-diyas-with-jasmine-and-lantern-light',
  14: 'golden-diwali-diyas-with-jasmine',
  15: 'golden-diwali-idol-with-glowing-lantern',
  16: 'golden-diya-collection-on-woven-mat',
  17: 'golden-diya-with-jasmine-and-lantern-glow',
  18: 'golden-ganesha-diya-centrepiece',
  19: 'golden-ganesha-diya-with-festive-bokeh',
  20: 'golden-lotus-diyas-on-a-jute-mat',
  21: 'mandala-terracotta-diya-on-jute-base',
  22: 'ornate-terracotta-diyas-in-golden-light',
  23: 'rustic-terracotta-bowl-with-floral-motif',
  24: 'rustic-terracotta-diya-set-in-warm-light',
  25: 'rustic-terracotta-hanging-diya-lantern',
  26: 'sunlit-terracotta-diya-on-jute-mat',
  27: 'terracotta-diya-on-jute-platform',
  28: 'terracotta-diya-on-a-jute-mat',
  29: 'terracotta-diya-with-jasmine-and-brass-glow',
  30: 'terracotta-diya-with-jasmine-and-lantern-glow',
  32: 'warm-terracotta-diya-on-jute-mat',
  33: 'warm-terracotta-diya-with-lantern-glow',
  34: 'warm-terracotta-diyas-on-jute-platform',
  35: 'rustic-terracotta-bowl-with-floral-motif',
};

// Empty placeholder (no artwork) used until a photo is added for a product.
const BLANK_IMAGE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="none"/></svg>')}`;

export function getProductImage(productId) {
  if (PHOTOS[productId]) return `/images/products/${PHOTOS[productId]}.webp`;

  // Products without a photo show a blank slot.
  // To add one: drop the file in public/images/products/ and add its id + file name to PHOTOS above.
  return BLANK_IMAGE;
}

// Small square version (560px) for cards, cart and checkout so lists load fast.
export function getProductThumb(productId) {
  if (PHOTOS[productId]) return `/images/products/thumbs/${PHOTOS[productId]}.webp`;
  return getProductImage(productId);
}

// Every distinct product photo (full size + thumbnail), used by the Gallery page.
export function getAllProductPhotos() {
  return [...new Set(Object.values(PHOTOS))].map((file) => ({
    src: `/images/products/${file}.webp`,
    thumb: `/images/products/thumbs/${file}.webp`,
    alt: file.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  }));
}

// ── Gallery / size charts ───────────────────────────────────────────────
// Drop images in src/assets/size-charts/ and they are picked up automatically:
//   <product-slug>.webp         → the size-chart image (shown as the 2nd picture)
//   <product-slug>--2.webp ...  → optional extra pictures (3rd, 4th ...)
// .webp .png .jpg .jpeg .avif all work. No code change needed for new products.
const galleryFiles = import.meta.glob('/src/assets/size-charts/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const sizeCharts = {};
const extraImages = {};
Object.entries(galleryFiles).forEach(([path, url]) => {
  const stem = path.split('/').pop().replace(/\.[^.]+$/, '');
  const [slug, extra] = stem.split('--');
  if (extra === undefined) sizeCharts[slug] = url;
  else (extraImages[slug] ||= []).push({ key: extra, url });
});

export function getProductGallery(product, name) {
  const title = name || product.name;
  const images = [{ src: getProductImage(product.id), alt: title, label: 'Photo' }];
  if (sizeCharts[product.slug]) {
    images.push({ src: sizeCharts[product.slug], alt: `${title} – size chart`, label: 'Size' });
  }
  (extraImages[product.slug] || [])
    .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))
    .forEach((x, i) => images.push({ src: x.url, alt: `${title} – image ${i + 3}`, label: `${i + 3}` }));
  return images;
}

export default getProductImage;
