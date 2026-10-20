import { motion } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';
import Seo from '../components/Seo';
import './Info.css';

const EN = {
  title: 'Certifications',
  subtitle: 'Our government registrations, available to view and download.',
  view: 'View PDF',
  download: 'Download',
  issuedTo: 'Registered business',
  issuedToText: 'V Square Manufacturing Traders (Alayam Pooja Products), Aladi Road, MRK Nagar, Virudhachalam, Cuddalore, Tamil Nadu – 606001.',
};

const TA = {
  title: 'சான்றிதழ்கள்',
  subtitle: 'எங்கள் அரசு பதிவுச் சான்றிதழ்களைப் பார்க்கவும், பதிவிறக்கவும்.',
  view: 'PDF பார்க்க',
  download: 'பதிவிறக்கு',
  issuedTo: 'பதிவு செய்யப்பட்ட நிறுவனம்',
};

const CERTS = [
  {
    id: 'gst',
    title: 'GST Registration Certificate',
    issuer: 'Government of India · Form GST REG-06',
    preview: '/certificates/gst-preview.webp',
    pdf: '/certificates/gst-registration-certificate.pdf',
    file: 'Alayam-GST-Registration-Certificate.pdf',
    width: 910,
    height: 1285,
    details: [
      ['GSTIN', '33AMNPV6562D1ZQ'],
      ['Legal name', 'Mani Vidya'],
      ['Trade name', 'V Square Manufacturing Traders'],
      ['Constitution', 'Proprietorship'],
      ['Registration type', 'Regular'],
      ['Valid from', '22 Sep 2023'],
    ],
  },
  {
    id: 'udyam',
    title: 'Udyam Registration Certificate',
    issuer: 'Ministry of Micro, Small & Medium Enterprises',
    preview: '/certificates/udyam-preview.webp',
    pdf: '/certificates/udyam-registration-certificate.pdf',
    file: 'Alayam-Udyam-Registration-Certificate.pdf',
    width: 1287,
    height: 909,
    details: [
      ['Udyam number', 'UDYAM-TN-04-0038985'],
      ['Enterprise', 'V Square Manufacturing Traders'],
      ['Enterprise type', 'Micro'],
      ['Major activity', 'Manufacturing'],
      ['Udyam registered', '1 Mar 2023'],
    ],
  },
];

export default function Certifications() {
  const { language } = useLanguage();
  const c = language === 'ta' ? { ...EN, ...TA } : EN;

  return (
    <div className="info-page">
      <Seo
        title="Certifications – GST & Udyam Registration | Alayam Pooja Products"
        description="View and download the GST registration and Udyam (MSME) registration certificates of Alayam Pooja Products (V Square Manufacturing Traders), Virudhachalam, Tamil Nadu."
        path="/certifications"
      />

      <section className="info-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="info-hero__title">{c.title}</h1>
            <div className="divider" />
            <p className="info-hero__subtitle">{c.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="info-section info-section--tight">
        <div className="container">
          <div className="cert-grid">
            {CERTS.map((cert, i) => (
              <motion.article
                key={cert.id}
                className="cert-card liquid-glass"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              >
                <a
                  className="cert-card__preview"
                  href={cert.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.view}: ${cert.title}`}
                >
                  <img src={cert.preview} alt={cert.title} width={cert.width} height={cert.height} loading="lazy" decoding="async" />
                </a>

                <div className="cert-card__body">
                  <p className="info-eyebrow">{cert.issuer}</p>
                  <h2 className="cert-card__title">{cert.title}</h2>

                  <dl className="cert-card__details">
                    {cert.details.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="info-actions info-actions--left">
                    <a href={cert.pdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">{c.view}</a>
                    <a href={cert.pdf} download={cert.file} className="btn btn-glass btn-sm">{c.download}</a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="cert-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="cert-note__label">{c.issuedTo}</span>
            <p>{EN.issuedToText}</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
