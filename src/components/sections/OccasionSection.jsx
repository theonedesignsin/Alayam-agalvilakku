import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';

export default function OccasionSection() {
  const { t } = useLanguage();

  const occasions = [
    { name: t('home.occasion.pooja'), icon: '🙏' },
    { name: t('home.occasion.deepavali'), icon: '🪔' },
    { name: t('home.occasion.karthigai'), icon: '🔥' },
    { name: t('home.occasion.navaratri'), icon: '🪷' },
    { name: t('home.occasion.weddings'), icon: '💍' },
    { name: t('home.occasion.housewarming'), icon: '🏠' },
    { name: t('home.occasion.gifting'), icon: '🎁' },
    { name: t('home.occasion.more'), icon: '✨' },
  ];

  return (
    <section id="festival" className="section occasion-section">
      <div className="container occasion-section__inner">
        <motion.div
          className="occasion-section__intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title">{t('home.occasion.title')}</h2>
          <div className="divider" />
          <p className="occasion-section__text">{t('home.occasion.subtitle')}</p>
          <p className="occasion-section__text">{t('home.occasion.festivalText')}</p>
          <Link to="/products" className="btn btn-primary">{t('home.occasion.shop')}</Link>
        </motion.div>

        <div className="occasion-section__grid">
          {occasions.map((occ, i) => (
            <motion.div
              key={occ.name}
              className="occasion-card liquid-glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <span className="occasion-card__icon" aria-hidden="true">{occ.icon}</span>
              <span className="occasion-card__name">{occ.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
