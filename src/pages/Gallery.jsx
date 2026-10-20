import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../store/LanguageContext';
import { getAllProductPhotos } from '../utils/productImages';
import Seo from '../components/Seo';
import './Info.css';

/* Photos you add to src/assets/gallery/ show up here automatically (before the product photos). */
const ownFiles = import.meta.glob('/src/assets/gallery/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const EN = {
  title: 'Gallery',
  subtitle: 'A look at our handcrafted lamps — tap any picture to view it larger.',
  close: 'Close',
  prev: 'Previous picture',
  next: 'Next picture',
};

const TA = {
  title: 'படத்தொகுப்பு',
  subtitle: 'எங்கள் கைவினை விளக்குகளின் தொகுப்பு — பெரிதாகப் பார்க்க படத்தைத் தொடவும்.',
  close: 'மூடு',
  prev: 'முந்தைய படம்',
  next: 'அடுத்த படம்',
};

function useGalleryImages() {
  return useMemo(() => {
    const own = Object.entries(ownFiles)
      .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
      .map(([path, url]) => ({
        src: url,
        thumb: url,
        alt: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      }));
    return [...own, ...getAllProductPhotos()];
  }, []);
}

function Lightbox({ images, index, onClose, onChange, labels }) {
  const touchX = useRef(null);
  const total = images.length;
  const go = useCallback((dir) => onChange((index + dir + total) % total), [index, total, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose]);

  const img = images[index];

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <button className="lightbox__btn lightbox__close" onClick={onClose} aria-label={labels.close}>✕</button>
      <button className="lightbox__btn lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={labels.prev}>‹</button>
      <button className="lightbox__btn lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={labels.next}>›</button>

      <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
        <img key={img.src} className="lightbox__img" src={img.src} alt={img.alt} onError={(e) => { if (e.currentTarget.src !== img.thumb) e.currentTarget.src = img.thumb; }} />
        <figcaption className="lightbox__caption">
          <span>{img.alt}</span>
          <span className="lightbox__count">{index + 1} / {total}</span>
        </figcaption>
      </figure>
    </motion.div>
  );
}

export default function Gallery() {
  const { language } = useLanguage();
  const c = language === 'ta' ? { ...EN, ...TA } : EN;
  const images = useGalleryImages();
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className="info-page">
      <Seo
        title="Gallery – Handmade Clay Diya & Agal Vilakku Photos | Alayam Pooja Products"
        description="Photo gallery of handcrafted terracotta diya lamps and agal vilakku from Alayam Pooja Products, Virudhachalam, Tamil Nadu."
        path="/gallery"
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
          <div className="gallery-grid">
            {images.map((img, i) => (
              <motion.button
                key={img.src}
                type="button"
                className="gallery-item"
                onClick={() => setOpen(i)}
                aria-label={img.alt}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '120px' }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.05, ease: 'easeOut' }}
              >
                <img src={img.thumb} alt={img.alt} width="560" height="560" loading="lazy" decoding="async" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <Lightbox images={images} index={open} onClose={close} onChange={setOpen} labels={c} />
        )}
      </AnimatePresence>
    </div>
  );
}
