import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/LanguageContext';
import { WHATSAPP_BUSINESS_NUMBER } from '../config';
import Seo from '../components/Seo';
import './Info.css';

/* English copy. Tamil overrides below; anything not translated falls back to English. */
const EN = {
  badge: 'Since 2002',
  title: 'About Us',
  subtitle: 'Alayam Pooja Products — leading Agal Vilakku manufacturer and exporter from Virudhachalam, Tamil Nadu.',
  intro1:
    'Established in 2002, Alayam Pooja Products is a trusted manufacturer, supplier and exporter of traditional pooja products based in Virudhachalam, Tamil Nadu, India, specialising in Colour Agal Vilakku and Wax Agal Vilakku. Founded by Mr. MJ Martin, our company was built on a passion for quality craftsmanship and the cultural significance of lighting lamps during prayers and auspicious occasions.',
  intro2:
    'Today, we are led by M. Vidhya Mani, continuing our journey of serving wholesale buyers, retailers, distributors and customers with dedication, trust and consistent quality.',

  storyTitle: 'Our Story',
  story1:
    'Since 2002, our purpose has been simple: to make traditional pooja products accessible to more people while preserving their cultural importance.',
  story2:
    'The agal vilakku represents light, positivity, prosperity and the removal of darkness. From daily prayers to festivals like Karthigai Deepam and Diwali, and from religious ceremonies to weddings, these lamps are part of countless occasions.',
  story3:
    'At Alayam Pooja Products, we contribute to this tradition with lamps that bring colour, beauty and devotion to every celebration.',

  stats: [
    { value: '2002', label: 'Established' },
    { value: '35–45', label: 'Skilled workers' },
    { value: '10–15 lakh', label: 'Pieces per month' },
    { value: '8', label: 'Markets served' },
  ],

  specialTitle: 'Our Speciality Products',
  specials: [
    {
      name: 'Colour Agal Vilakku',
      text: 'Our Colour Agal Vilakku collection brings vibrancy and elegance to traditional worship. Designed for pooja rituals, festive decorations, return gifts and special occasions, these colourful clay lamps suit homes, temples and celebrations.',
    },
    {
      name: 'Wax Agal Vilakku',
      text: 'Our Wax Agal Vilakku range is a distinctive choice for buyers looking for decorative and traditional lighting. With their attractive finish and suitability for festive occasions, these lamps add warmth and charm to every celebration.',
    },
  ],

  capacityTitle: 'Our Manufacturing Capacity',
  capacityIntro:
    'As an experienced agal vilakku manufacturer in Virudhachalam, we are equipped to handle both small and large bulk orders.',
  capacity: [
    { k: 'Skilled Workforce', v: 'A dedicated team of 35 to 45 trained workers from the rural areas around Virudhachalam' },
    { k: 'Monthly Production Capacity', v: '10 lakh to 15 lakh (1 million to 1.5 million) pieces per month' },
    { k: 'Bulk and Wholesale Orders', v: 'Suitable for retailers, distributors, importers and festival-season demand' },
    { k: 'Reliable Supply', v: 'Consistent quality and on-time delivery for domestic and export orders' },
  ],

  womenTitle: 'Empowering Rural Women Through Employment',
  women1:
    'At Alayam Pooja Products, we believe a business should grow together with its community. Our workforce is drawn from the rural villages around Virudhachalam, and we are proud to be providing employment opportunities to women from rural areas.',
  women2:
    'By creating stable jobs close to home, we help these women earn an income, build skills, support their families and gain financial independence. Every lamp we make carries the hard work and dedication of the skilled hands behind it, and every order you place helps support rural livelihoods in Tamil Nadu.',

  globalTitle: 'Our Global Presence',
  globalSubtitle: 'Exporting pooja products worldwide',
  globalText:
    'Alayam Pooja Products proudly serves international markets, helping Indian traditions and festive celebrations reach customers across the globe.',
  markets: ['India', 'United States of America', 'Canada', 'European countries', 'South Africa', 'Arab countries', 'Malaysia', 'Singapore'],
  globalFoot:
    'Through our international reach, we make traditional Indian pooja products available to customers, retailers, distributors and businesses worldwide.',

  missionTitle: 'Our Mission',
  mission:
    'To preserve and promote the beauty of traditional Indian pooja products by delivering distinctive designs, dependable quality and products that bring people closer to their traditions, while creating employment for rural communities. We aspire to make every lamp a symbol of devotion, celebration and togetherness.',
  visionTitle: 'Our Vision',
  vision:
    'To establish Alayam Pooja Products as a trusted name in traditional pooja products in India and international markets, expanding our reach while remaining connected to our cultural roots and the communities that support us.',

  whyTitle: 'Why Choose Alayam Pooja Products?',
  why: [
    { k: 'Established in 2002', v: 'More than two decades of experience in the pooja products industry' },
    { k: 'Based in Virudhachalam', v: 'Manufacturing close to the source, with a skilled local workforce' },
    { k: 'High Production Capacity', v: '10–15 lakh pieces per month with a team of 35–45 skilled workers' },
    { k: 'Supporting Rural Women', v: 'Providing jobs and livelihood to women from rural areas around Virudhachalam' },
    { k: 'Distinctive Specialities', v: 'Known for Colour Agal Vilakku and Wax Agal Vilakku' },
    { k: 'Tradition-Inspired Designs', v: 'Products rooted in the cultural importance of Indian worship and festivals' },
    { k: 'International Reach', v: 'Exporting to North America, Europe, Africa, the Middle East and Asia' },
    { k: 'Customer Commitment', v: 'Lasting relationships with customers and business partners' },
  ],

  closeTitle: 'Lighting Traditions Across the World',
  closeText:
    'A lamp is more than a source of light. It represents hope, positivity, devotion and the timeless traditions that connect generations. From our beginnings in 2002 in Virudhachalam to our growing international presence, we remain committed to bringing the warmth of traditional lighting to homes and celebrations around the world.',
  closeTag: 'Alayam Pooja Products – Bringing Tradition to Light.',
  closeCta: 'Looking for bulk or wholesale agal vilakku from Virudhachalam? Contact us for pricing, samples and export enquiries.',
  shop: 'Shop Lamps',
  enquire: 'Enquire on WhatsApp',
  waText: 'Hello Alayam Pooja Products, I would like to enquire about bulk / wholesale agal vilakku.',
};

const TA = {
  badge: '2002 முதல்',
  title: 'எங்களைப் பற்றி',
  storyTitle: 'எங்கள் கதை',
  stats: [
    { value: '2002', label: 'தொடங்கிய ஆண்டு' },
    { value: '35–45', label: 'திறமையான பணியாளர்கள்' },
    { value: '10–15 லட்சம்', label: 'மாதம் தயாரிப்பு' },
    { value: '8', label: 'சேவை செய்யும் சந்தைகள்' },
  ],
  specialTitle: 'எங்கள் சிறப்புப் பொருட்கள்',
  specials: [
    { name: 'கலர் அகல் விளக்கு', text: EN.specials[0].text },
    { name: 'மெழுகு அகல் விளக்கு', text: EN.specials[1].text },
  ],
  capacityTitle: 'எங்கள் உற்பத்தித் திறன்',
  womenTitle: 'கிராமப்புறப் பெண்களுக்கு வேலைவாய்ப்பு',
  globalTitle: 'உலகளாவிய இருப்பு',
  globalSubtitle: 'பூஜை பொருட்கள் உலகெங்கும் ஏற்றுமதி',
  markets: ['இந்தியா', 'அமெரிக்க ஐக்கிய நாடுகள்', 'கனடா', 'ஐரோப்பிய நாடுகள்', 'தென்னாப்பிரிக்கா', 'அரபு நாடுகள்', 'மலேசியா', 'சிங்கப்பூர்'],
  missionTitle: 'எங்கள் நோக்கம்',
  visionTitle: 'எங்கள் தொலைநோக்கு',
  whyTitle: 'ஏன் ஆலயம் பூஜை பொருட்கள்?',
  closeTitle: 'உலகெங்கும் பாரம்பரியத்தை ஒளிரச் செய்கிறோம்',
  shop: 'விளக்குகளை வாங்குங்கள்',
  enquire: 'வாட்ஸ்அப்பில் விசாரிக்கவும்',
};

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease: 'easeOut' },
};

export default function About() {
  const { language } = useLanguage();
  const c = language === 'ta' ? { ...EN, ...TA } : EN;
  const waLink = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(c.waText)}`;

  return (
    <div className="info-page">
      <Seo
        title="About Us – Agal Vilakku Manufacturer & Exporter, Virudhachalam | Alayam Pooja Products"
        description="Alayam Pooja Products, established 2002 in Virudhachalam, Tamil Nadu – manufacturer and exporter of Colour Agal Vilakku and Wax Agal Vilakku. 10–15 lakh pieces a month, supporting rural women."
        path="/about"
      />

      {/* Hero */}
      <section className="info-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge badge-gold">{c.badge}</span>
            <h1 className="info-hero__title">{c.title}</h1>
            <div className="divider" />
            <p className="info-hero__subtitle">{c.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Intro + story */}
      <section className="info-section">
        <div className="container info-narrow">
          <motion.div className="info-lead" {...fade}>
            <p>{c.intro1}</p>
            <p>{c.intro2}</p>
          </motion.div>

          <motion.div className="info-block" {...fade}>
            <h2 className="info-heading">{c.storyTitle}</h2>
            <div className="divider info-divider-left" />
            <p>{c.story1}</p>
            <p>{c.story2}</p>
            <p>{c.story3}</p>
          </motion.div>
        </div>
      </section>

      {/* Numbers */}
      <section className="info-section info-section--tight">
        <div className="container">
          <div className="info-stats">
            {c.stats.map((s, i) => (
              <motion.div key={s.label} className="info-stat liquid-glass" {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
                <span className="info-stat__value">{s.value}</span>
                <span className="info-stat__label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialities */}
      <section className="info-section">
        <div className="container">
          <motion.div {...fade}>
            <h2 className="section-title">{c.specialTitle}</h2>
            <div className="divider" />
          </motion.div>
          <div className="info-grid info-grid--2">
            {c.specials.map((s, i) => (
              <motion.article key={s.name} className="info-card liquid-glass" {...fade} transition={{ ...fade.transition, delay: i * 0.1 }}>
                <span className="info-card__icon" aria-hidden="true">{i === 0 ? '✦' : '❖'}</span>
                <h3 className="info-card__title">{s.name}</h3>
                <p>{s.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Capacity */}
      <section className="info-section">
        <div className="container">
          <motion.div {...fade}>
            <h2 className="section-title">{c.capacityTitle}</h2>
            <div className="divider" />
            <p className="section-subtitle">{c.capacityIntro}</p>
          </motion.div>
          <div className="info-grid info-grid--4">
            {c.capacity.map((x, i) => (
              <motion.div key={x.k} className="info-card info-card--compact liquid-glass" {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
                <h3 className="info-card__title">{x.k}</h3>
                <p>{x.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rural women */}
      <section className="info-section">
        <div className="container">
          <motion.div className="info-feature liquid-glass-strong" {...fade}>
            <h2 className="info-heading">{c.womenTitle}</h2>
            <div className="divider info-divider-left" />
            <p>{c.women1}</p>
            <p>{c.women2}</p>
          </motion.div>
        </div>
      </section>

      {/* Global */}
      <section className="info-section">
        <div className="container info-narrow info-center">
          <motion.div {...fade}>
            <h2 className="section-title">{c.globalTitle}</h2>
            <div className="divider" />
            <p className="info-eyebrow">{c.globalSubtitle}</p>
            <p>{c.globalText}</p>
            <ul className="info-chips">
              {c.markets.map((m) => (
                <li key={m} className="info-chip">{m}</li>
              ))}
            </ul>
            <p>{c.globalFoot}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid info-grid--2">
            <motion.article className="info-card liquid-glass" {...fade}>
              <h2 className="info-card__title info-card__title--lg">{c.missionTitle}</h2>
              <div className="divider info-divider-left" />
              <p>{c.mission}</p>
            </motion.article>
            <motion.article className="info-card liquid-glass" {...fade} transition={{ ...fade.transition, delay: 0.1 }}>
              <h2 className="info-card__title info-card__title--lg">{c.visionTitle}</h2>
              <div className="divider info-divider-left" />
              <p>{c.vision}</p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="info-section">
        <div className="container">
          <motion.div {...fade}>
            <h2 className="section-title">{c.whyTitle}</h2>
            <div className="divider" />
          </motion.div>
          <div className="info-grid info-grid--4">
            {c.why.map((x, i) => (
              <motion.div key={x.k} className="info-card info-card--compact liquid-glass" {...fade} transition={{ ...fade.transition, delay: (i % 4) * 0.07 }}>
                <span className="info-card__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="info-card__title">{x.k}</h3>
                <p>{x.v}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="info-section info-section--last">
        <div className="container info-narrow info-center">
          <motion.div {...fade}>
            <h2 className="section-title">{c.closeTitle}</h2>
            <div className="divider" />
            <p>{c.closeText}</p>
            <p className="info-tag">{c.closeTag}</p>
            <p className="info-cta-text">{c.closeCta}</p>
            <div className="info-actions">
              <Link to="/products" className="btn btn-primary">{c.shop}</Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-glass">{c.enquire}</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
