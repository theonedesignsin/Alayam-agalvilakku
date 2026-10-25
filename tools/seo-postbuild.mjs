// Runs after `vite build`. Creates sitemap.xml and a real HTML file for every page
// (/, /products, /product/<slug>) with its own title, description, canonical, Open Graph tags
// and readable text, so Google and WhatsApp/Facebook previews work even before JavaScript runs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const load = (p) => import(pathToFileURL(path.join(root, p)).href);

const { SITE_URL, SITE_NAME } = await load('src/config.js');
const { default: products } = await load('src/data/products.js');
const { productDescription, productLongText } = await load('src/data/seo.js');
const photos = fs.readFileSync(path.join(root, 'src/utils/productImages.js'), 'utf8');
const photoFor = (id) => (photos.match(new RegExp(`\\n\\s*${id}: '([^']+)'`)) || [])[1];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

function page({ route, title, description, image, body, type = 'website' }) {
  const url = `${SITE_URL}${route}`;
  const head = `<!--seo-->
    <title data-seo-static>${esc(title)}</title>
    <meta data-seo-static name="description" content="${esc(description)}" />
    <link data-seo-static rel="canonical" href="${url}" />
    <meta data-seo-static property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta data-seo-static property="og:type" content="${type}" />
    <meta data-seo-static property="og:title" content="${esc(title)}" />
    <meta data-seo-static property="og:description" content="${esc(description)}" />
    <meta data-seo-static property="og:url" content="${url}" />
    <meta data-seo-static property="og:image" content="${SITE_URL}${image}" />
    <meta data-seo-static name="twitter:card" content="summary_large_image" />
    <!--/seo-->`;
  let html = template.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head);
  html = html.replace(/<!--noscript-seo-->[\s\S]*?<!--\/noscript-seo-->/,
    `<noscript>${body}</noscript>`);
  return html;
}

const write = (route, html) => {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

const nav = `<nav><a href="/">Home</a> | <a href="/products">All Lamps</a> | <a href="/about">About Us</a> | <a href="/certifications">Certifications</a> | <a href="/gallery">Gallery</a></nav>`;
const list = products.map((p) => `<li><a href="/product/${p.slug}">${esc(p.name)}</a></li>`).join('');

write('/', page({
  route: '/',
  title: 'Agal Vilakku, Handmade Clay Diya & Pooja Products in Virudhachalam, Cuddalore | Alayam',
  description: 'Alayam Pooja Products, Virudhachalam – handmade agal vilakku, terracotta diya lamps and pooja items for Deepavali, Karthigai Deepam and gifting. Serving Cuddalore, Tamil Nadu and all India.',
  image: '/images/logo.webp',
  body: `<h1>Agal Vilakku &amp; Handmade Diya Lamps – Virudhachalam, Cuddalore</h1>${nav}
  <p>Alayam Pooja Products (V Square Manufacturing Traders), Aladi Road, MRK Nagar, Virudhachalam, Cuddalore, Tamil Nadu 606001. Handmade terracotta agal vilakku, diya lamps and pooja products. Phone/WhatsApp+91 9363512227.</p><ul>${list}</ul>`,
}));

write('/products', page({
  route: '/products',
  title: 'Handmade Clay Diya & Agal Vilakku – Shop All Lamps | Alayam Pooja Products',
  description: 'Shop handmade terracotta diya lamps, agal vilakku and pooja products from Virudhachalam, Cuddalore. Deepavali, Karthigai Deepam and gift diyas. Delivery across India.',
  image: '/images/logo.webp',
  body: `<h1>All Handmade Diya Lamps</h1>${nav}<ul>${list}</ul>`,
}));

write('/about', page({
  route: '/about',
  title: 'About Us – Agal Vilakku Manufacturer & Exporter, Virudhachalam | Alayam Pooja Products',
  description: 'Alayam Pooja Products, established 2002 in Virudhachalam, Tamil Nadu – manufacturer and exporter of Colour Agal Vilakku and Wax Agal Vilakku. 10–15 lakh pieces a month, supporting rural women.',
  image: '/images/logo-emblem.webp',
  body: `<h1>About Us – Alayam Pooja Products</h1>${nav}<p>Established in 2002, Alayam Pooja Products is a manufacturer, supplier and exporter of traditional pooja products in Virudhachalam, Tamil Nadu, specialising in Colour Agal Vilakku and Wax Agal Vilakku. Monthly capacity 10 lakh to 15 lakh pieces. Exports to the USA, Canada, Europe, South Africa, Arab countries, Malaysia and Singapore.</p>`,
}));

write('/certifications', page({
  route: '/certifications',
  title: 'Certifications – GST & Udyam Registration | Alayam Pooja Products',
  description: 'View and download the GST registration and Udyam (MSME) registration certificates of Alayam Pooja Products (V Square Manufacturing Traders), Virudhachalam, Tamil Nadu.',
  image: '/images/logo-emblem.webp',
  body: `<h1>Certifications</h1>${nav}<ul><li><a href="/certificates/gst-registration-certificate.pdf">GST Registration Certificate</a></li><li><a href="/certificates/udyam-registration-certificate.pdf">Udyam Registration Certificate</a></li></ul>`,
}));

write('/gallery', page({
  route: '/gallery',
  title: 'Gallery – Handmade Clay Diya & Agal Vilakku Photos | Alayam Pooja Products',
  description: 'Photo gallery of handcrafted terracotta diya lamps and agal vilakku from Alayam Pooja Products, Virudhachalam, Tamil Nadu.',
  image: '/images/logo-emblem.webp',
  body: `<h1>Gallery</h1>${nav}<p>Photos of our handcrafted clay diya lamps and agal vilakku.</p>`,
}));

for (const p of products) {
  const photo = photoFor(p.id);
  write(`/product/${p.slug}`, page({
    route: `/product/${p.slug}`,
    title: `${p.name} – Handmade Clay Diya | ${SITE_NAME}`,
    description: productDescription(p),
    image: photo ? `/images/products/thumbs/${photo}.webp` : '/images/logo.webp',
    type: 'product',
    body: `<h1>${esc(p.name)}</h1>${nav}<p>${esc(productLongText(p))}</p>`,
  }));
}

// sitemap.xml (skips duplicate listings automatically since slugs are unique)
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/products', '/about', '/certifications', '/gallery', ...products.map((p) => `/product/${p.slug}`)];
const seen = new Set();
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.filter((u) => !seen.has(u) && seen.add(u)).map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u === '/products' ? '0.9' : ['/about', '/certifications', '/gallery'].includes(u) ? '0.6' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
console.log(`SEO: wrote ${urls.length} pages + sitemap.xml`);
