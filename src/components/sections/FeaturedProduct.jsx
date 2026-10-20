import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById } from '../../data/products';
import { getTranslatedProduct } from '../../data/productTranslations';
import getProductImage from '../../utils/productImages';
import QuantitySelector from '../ui/QuantitySelector';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import { useLanguage } from '../../store/LanguageContext';

const SIGNATURE_PRODUCT_ID = 25; // Rustic Terracotta Hanging Diya Lantern

export default function FeaturedProduct() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const product = getProductById(SIGNATURE_PRODUCT_ID);
  const addToCart = useCartStore((state) => state.addToCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const tp = getTranslatedProduct(product, language);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showNotification(`${tp.name} (×${quantity}) ${t('notification.addedToCart')}`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <section className="section featured-product">
      <div className="container">
        <div className="featured-product__inner">
          <motion.div
            className="featured-product__image-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="featured-product__image-glow" />
            <img
              src={getProductImage(product.id)}
              alt={tp.name}
              className="featured-product__image"
              width="1024"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </motion.div>

          <motion.div
            className="featured-product__info"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="badge badge-gold">{t('home.featured.badge')}</span>
            <h2 className="featured-product__name">{tp.name}</h2>
            <p className="featured-product__desc">
              {t('home.featured.desc')}
            </p>

            <div className="featured-product__actions">
              <div className="featured-product__qty">
                <label>{t('product.quantity')}</label>
                <QuantitySelector
                  quantity={quantity}
                  max={product.availableQty}
                  onChange={setQuantity}
                />
              </div>

              <div className="featured-product__buttons">
                <button className="btn btn-primary btn-lg" onClick={handleBuyNow}>
                  {t('product.buyNow')}
                </button>
                <button className="btn btn-glass btn-lg" onClick={handleAddToCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {t('product.addToCart')}
                </button>
              </div>
            </div>

            <Link to={`/product/${product.slug}`} className="featured-product__view-link">
              {t('home.featured.viewDetails')}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
