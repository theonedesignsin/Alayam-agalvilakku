import { lazy, Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import useUIStore from '../../store/uiStore';
import HeroFireworks from './HeroFireworks';

/* The 3D scene (three.js) is loaded after first paint so the door intro starts instantly */
const DiyaScene = lazy(() => import('../3d/DiyaScene'));

/* While the doors are still sliding open the lamp sits in the middle of the
   screen. As soon as they are fully open (REVEALING) it glides back home. */
const CENTER_PHASES = ['closed', 'anticipation', 'opening'];
const CENTER_SCALE = 1.12;
const GLIDE_HOME = { duration: 1.4, ease: [0.65, 0, 0.35, 1] };

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export default function HeroSection() {
  const { t } = useLanguage();
  const [lit, setLit] = useState(true);

  /* ── Door-intro choreography ───────────────────────────── */
  const isLoading = useUIStore((state) => state.isLoading);
  const introPhase = useUIStore((state) => state.introPhase);
  const centered = isLoading && !prefersReducedMotion() && CENTER_PHASES.includes(introPhase);

  /* Distance from the lamp's resting place to the centre of the viewport.
     `slotRef` is the un-transformed layout box, so the measurement is stable. */
  const slotRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const rect = slotRef.current?.getBoundingClientRect();
      if (!rect) return;
      setOffset({
        x: window.innerWidth / 2 - (rect.left + rect.width / 2),
        y: window.innerHeight / 2 - (rect.top + rect.height / 2),
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Blur the rest of the page while the lamp is centred, then release it
     smoothly (CSS lives in Home.css) when the lamp heads back. */
  useEffect(() => {
    const { classList } = document.body;
    if (centered) {
      classList.remove('intro-lamp-release');
      classList.add('intro-lamp-center');
      return undefined;
    }
    if (classList.contains('intro-lamp-center')) {
      classList.replace('intro-lamp-center', 'intro-lamp-release');
      const id = setTimeout(() => classList.remove('intro-lamp-release'), 1400);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [centered]);

  useEffect(
    () => () => document.body.classList.remove('intro-lamp-center', 'intro-lamp-release'),
    []
  );

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__ambient-glow" />
      <div className="hero__grid-bg" />
      <HeroFireworks />

      <div className="container hero__inner">
        {/* LEFT HALF — animated 3D lamp
            (outer box = fixed layout slot, inner box = the part that travels) */}
        <div className="hero__model" ref={slotRef}>
          <motion.div
            className="hero__model-inner"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: centered ? offset.x : 0,
              y: centered ? offset.y : 0,
              scale: centered ? CENTER_SCALE : 1,
            }}
            transition={
              centered
                ? { default: { duration: 0 }, opacity: { duration: 1, ease: 'easeOut' } }
                : { default: GLIDE_HOME }
            }
          >
            <Suspense fallback={<div className="diya-fallback" aria-hidden="true" />}>
              <DiyaScene lit={lit} />
            </Suspense>
          </motion.div>

          {/* Flame on / off switch — hidden while the lamp is centred */}
          <button
            type="button"
            role="switch"
            aria-checked={lit}
            aria-label="Lamp flame"
            tabIndex={centered ? -1 : 0}
            className={`hero__switch${lit ? ' is-on' : ''}${centered ? ' hero__switch--hidden' : ''}`}
            onClick={() => setLit((value) => !value)}
          >
            <span className="hero__switch-label">{lit ? 'ON' : 'OFF'}</span>
            <span className="hero__switch-knob" />
          </button>
        </div>

        {/* RIGHT HALF — text content */}
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1 className="hero__title">
            {t('home.hero.title1')}{' '}
            <span className="hero__title-accent">{t('home.hero.title2')}</span>
          </h1>

          <p className="hero__description">{t('home.hero.desc')}</p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/products" className="btn btn-primary btn-lg hero__cta">
              {t('home.hero.explore')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#heritage" className="btn btn-secondary btn-lg hero__cta-secondary">
              {t('home.hero.learnMore')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
