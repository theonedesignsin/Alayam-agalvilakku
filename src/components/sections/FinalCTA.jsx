import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';
import ScrollReveal from '../ui/ScrollReveal';

export default function FinalCTA() {
  const { t } = useLanguage();
  return (
    <section className="section final-cta">
      <div className="final-cta__glow" />
      <div className="container">
        <motion.div
          className="final-cta__inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="final-cta__label">{t('home.cta.label')}</span>
          <h2 className="final-cta__title">{t('home.cta.title')}</h2>
          <ScrollReveal className="final-cta__desc">{t('home.cta.desc')}</ScrollReveal>
          <div className="final-cta__actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              {t('home.cta.shopNow')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
