import { motion } from 'framer-motion';
import products from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import { useLanguage } from '../store/LanguageContext';
import Seo from '../components/Seo';
import './Products.css';

export default function Products() {
  const { t } = useLanguage();

  return (
    <div className="products-page">
      <Seo
        title="Handmade Clay Diya & Agal Vilakku – Shop All Lamps | Alayam Pooja Products"
        description="Shop handmade terracotta diya lamps, agal vilakku and pooja products from Virudhachalam, Cuddalore. Deepavali, Karthigai Deepam and gift diyas. Delivery across India."
        path="/products"
      />
      <section className="products-page__header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">{t('products.title')}</h1>
            <div className="divider" />
            <p className="section-subtitle">
              {t('products.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section products-page__grid-section">
        <div className="container">
          <div className="products-page__grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
