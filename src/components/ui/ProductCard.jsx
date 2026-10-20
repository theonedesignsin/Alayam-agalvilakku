import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductThumb } from '../../utils/productImages';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import { useLanguage } from '../../store/LanguageContext';
import { getTranslatedProduct } from '../../data/productTranslations';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const { t, language } = useLanguage();
  const tp = getTranslatedProduct(product, language);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    showNotification(`${tp.name} ${t('notification.addedToCart')}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '200px' }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.05, ease: 'easeOut' }}
      onClick={handleCardClick}
    >
      <div className="product-card__image-wrap">
        <img
          src={getProductThumb(product.id)}
          alt={tp.name}
          className="product-card__image"
          width="560"
          height="560"
          loading="lazy"
          decoding="async"
        />
        <div className="product-card__glow" />
      </div>

      <div className="product-card__info">
        <h3 className="product-card__name">{tp.name}</h3>

        <div className="product-card__footer">
          <div className="product-card__actions">
            <button
              className="btn btn-sm btn-glass"
              onClick={handleAddToCart}
              aria-label={`Add ${tp.name} to cart`}
            >
              {t('productCard.addToCart')}
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleBuyNow}>
              {t('productCard.buyNow')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
