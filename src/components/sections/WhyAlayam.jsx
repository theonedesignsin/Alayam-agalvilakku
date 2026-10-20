import { motion } from 'framer-motion';
import { useLanguage } from '../../store/LanguageContext';

export default function WhyAlayam() {
  const { t } = useLanguage();

  const features = [
    { icon: '✦', title: t('home.why.f1Title'), desc: t('home.why.f1Desc') },
    { icon: '◈', title: t('home.why.f2Title'), desc: t('home.why.f2Desc') },
    { icon: '★', title: t('home.why.f3Title'), desc: t('home.why.f3Desc') },
    { icon: '♡', title: t('home.why.f4Title'), desc: t('home.why.f4Desc') },
    { icon: '✧', title: t('home.why.f5Title'), desc: t('home.why.f5Desc') },
    { icon: '❖', title: t('home.why.f6Title'), desc: t('home.why.f6Desc') },
    { icon: '✺', title: t('home.why.f7Title'), desc: t('home.why.f7Desc') },
    { icon: '❋', title: t('home.why.f8Title'), desc: t('home.why.f8Desc') },
  ];

  return (
    <section id="why-alayam" className="section why-alayam">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="section-title">{t('home.why.title')}</h2>
          <div className="divider" />
          <p className="section-subtitle">{t('home.why.subtitle')}</p>
        </motion.div>

        <div className="why-alayam__grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="why-alayam__card liquid-glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <span className="why-alayam__icon" aria-hidden="true">{f.icon}</span>
              <div className="why-alayam__text">
                <h3 className="why-alayam__title">{f.title}</h3>
                <p className="why-alayam__desc">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
