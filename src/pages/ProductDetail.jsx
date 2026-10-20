import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductBySlug } from '../data/products';
import { getProductGallery, getProductImage } from '../utils/productImages';
import ProductGallery from '../components/ui/ProductGallery';
import { getTranslatedProduct } from '../data/productTranslations';
import QuantitySelector from '../components/ui/QuantitySelector';
import useCartStore from '../store/cartStore';
import useUIStore from '../store/uiStore';
import { useLanguage } from '../store/LanguageContext';
import Seo from '../components/Seo';
import { productDescription, productLongText } from '../data/seo';
import { SITE_URL, SITE_NAME } from '../config';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const addToCart = useCartStore((state) => state.addToCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const [quantity, setQuantity] = useState(1);
  const { t, language } = useLanguage();
  const tp = product ? getTranslatedProduct(product, language) : null;

  if (!product) {
    return (
      <div className="product-detail__not-found">
        <div className="container">
          <h2>{t('product.notFound')}</h2>
          <p>{t('product.notFoundDesc')}</p>
          <Link to="/products" className="btn btn-primary">
            {t('product.browseAll')}
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    showNotification(`${tp.name} (×${quantity}) ${t('notification.addedToCart')}`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const slugPath = `/product/${product.slug}`;
  const imgPath = getProductImage(product.id);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: productLongText(product),
    image: `${SITE_URL}${imgPath}`,
    sku: String(product.id),
    brand: { '@type': 'Brand', name: 'Alayam' },
  };

  return (
    <div className="product-detail">
      <Seo
        title={`${product.name} – Handmade Clay Diya | ${SITE_NAME}`}
        description={productDescription(product)}
        path={slugPath}
        image={imgPath}
        type="product"
        jsonLd={jsonLd}
      />
      <div className="container">
        {/* Breadcrumb */}
        <nav className="product-detail__breadcrumb">
          <Link to="/">{t('nav.home')}</Link>
          <span>/</span>
          <Link to="/products">{t('nav.shop')}</Link>
          <span>/</span>
          <span>{tp.name}</span>
        </nav>

        <div className="product-detail__grid">
          {/* Image */}
          <motion.div
            className="product-detail__image-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGallery images={getProductGallery(product, tp.name)} />
          </motion.div>

          {/* Info */}
          <motion.div
            className="product-detail__info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h1 className="product-detail__name">{tp.name}</h1>
            <div className="divider product-detail__divider" />
            <p className="product-detail__desc">{productLongText(product)}</p>


            {/* Quantity & Actions */}
            <div className="product-detail__actions">
              <div className="product-detail__qty">
                <label>{t('product.quantity')}</label>
                <QuantitySelector
                  quantity={quantity}
                  max={product.availableQty}
                  onChange={setQuantity}
                />
              </div>

              <div className="product-detail__buttons">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                >
                  {t('product.buyNow')}
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={handleAddToCart}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {t('product.addToCart')}
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="product-detail__trust">
              <div className="product-detail__trust-item">
                <span>🤲</span> {t('product.handmade')}
              </div>
              <div className="product-detail__trust-item">
                <span>🌿</span> {t('product.ecoFriendly')}
              </div>
              <div className="product-detail__trust-item">
                <span>📦</span> {t('product.securePackaging')}
              </div>
              <div className="product-detail__trust-item">
                <span>🚚</span> {t('product.panIndiaDelivery')}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
