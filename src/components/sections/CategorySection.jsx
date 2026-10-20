import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductThumb } from '../../utils/productImages';
import { useLanguage } from '../../store/LanguageContext';

// photoId = product whose photo represents the category
const CATEGORIES = [
  { key: 'c1', photoId: 1 },
  { key: 'c2', photoId: 27 },
  { key: 'c3', photoId: 22 },
  { key: 'c4', photoId: 5 },
];

export default function CategorySection() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="section category-section" aria-labelledby="categories-title">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 id="categories-title" className="section-title">{t('home.cat.title')}</h2>
          <div className="divider" />
          <p className="section-subtitle">{t('home.cat.subtitle')}</p>
        </motion.div>

        <div className="category-section__grid">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to="/products" className="category-card liquid-glass">
                <img
                  className="category-card__img"
                  src={getProductThumb(c.photoId)}
                  alt={t(`home.cat.${c.key}Title`)}
                  width="560"
                  height="560"
                  loading="lazy"
                  decoding="async"
                />
                <div className="category-card__body">
                  <h3 className="category-card__title">{t(`home.cat.${c.key}Title`)}</h3>
                  <p className="category-card__desc">{t(`home.cat.${c.key}Desc`)}</p>
                  <span className="category-card__link">{t(`home.cat.${c.key}Link`)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
