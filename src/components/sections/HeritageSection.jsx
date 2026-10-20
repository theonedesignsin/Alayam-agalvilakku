import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import { useLanguage } from '../../store/LanguageContext';

const PARTICLE_COUNT = 8;

export default function HeritageSection() {
  const { t } = useLanguage();

  /* Random once per mount — not on every re-render (e.g. a language switch) */
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        '--delay': `${i * 1.5}s`,
        '--x': `${15 + Math.random() * 70}%`,
        '--duration': `${10 + Math.random() * 10}s`,
      })),
    []
  );

  return (
    <section id="heritage" className="section heritage-section">
      <div className="heritage-section__glow" />

      <div className="container">
        <div className="heritage-section__inner">
          <motion.div
            className="heritage-section__content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="badge badge-gold">{t('home.heritage.badge')}</span>
            <h2 className="heritage-section__title">{t('home.heritage.title')}</h2>
            <ScrollReveal className="heritage-section__text">{t('home.heritage.p1')}</ScrollReveal>
            <ScrollReveal className="heritage-section__text">{t('home.heritage.p2')}</ScrollReveal>

            <div className="heritage-section__tagline">
              <div className="heritage-section__lamp-icon" aria-hidden="true">
                <div className="heritage-section__lamp-glow" />
                <svg viewBox="0 0 120 120" width="72" height="72">
                  <defs>
                    <linearGradient id="heritageFlame" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#E8A838" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFF8E1" />
                    </linearGradient>
                    <linearGradient id="heritageBrass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="100%" stopColor="#8A6D3B" />
                    </linearGradient>
                  </defs>
                  <ellipse cx="60" cy="85" rx="30" ry="12" fill="url(#heritageBrass)" opacity="0.8" />
                  <ellipse cx="60" cy="80" rx="24" ry="9" fill="#B08D57" />
                  <rect x="58" y="48" width="4" height="32" rx="2" fill="#3D2B1F" />
                  <path d="M60 20 Q54 34 56 45 Q58 50 60 50 Q62 50 64 45 Q66 34 60 20Z" fill="url(#heritageFlame)">
                    <animate
                      attributeName="d"
                      dur="2s"
                      repeatCount="indefinite"
                      values="M60 20 Q54 34 56 45 Q58 50 60 50 Q62 50 64 45 Q66 34 60 20Z;
                              M60 18 Q53 33 55 44 Q58 50 60 50 Q62 50 65 44 Q67 33 60 18Z;
                              M60 20 Q54 34 56 45 Q58 50 60 50 Q62 50 64 45 Q66 34 60 20Z"
                    />
                  </path>
                </svg>
              </div>
              <div>
                <h3 className="heritage-section__tagline-title">{t('home.tamil.title')}</h3>
                <p className="heritage-section__tagline-text">
                  {t('home.tamil.p1')} {t('home.tamil.p2')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="heritage-about liquid-glass"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="heritage-about__title">{t('home.about.title')}</h3>
            <p className="heritage-about__text">{t('home.about.p1')}</p>
            <p className="heritage-about__text">{t('home.about.p2')}</p>
            <ul className="heritage-about__list">
              <li>{t('home.about.l1')}</li>
              <li>{t('home.about.l2')}</li>
              <li>{t('home.about.l3')}</li>
            </ul>
            <Link to="/products" className="btn btn-primary">{t('home.about.cta')}</Link>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="heritage-section__particles">
        {particles.map((style, i) => (
          <div key={i} className="heritage-section__particle" style={style} />
        ))}
      </div>
    </section>
  );
}
