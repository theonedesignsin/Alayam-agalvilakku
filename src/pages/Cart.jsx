import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { getProductThumb } from '../utils/productImages';
import { getTranslatedProduct } from '../data/productTranslations';
import QuantitySelector from '../components/ui/QuantitySelector';
import { useLanguage } from '../store/LanguageContext';
import './Cart.css';

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { t, language } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <div className="container">
          <motion.div
            className="cart__empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="cart__empty-icon">🏺</div>
            <h2>{t('cart.empty')}</h2>
            <p>{t('cart.emptyDesc')}</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              {t('cart.browseLamps')}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="cart__title">{t('cart.title')}</h1>
          <p className="cart__count">{items.length} {items.length === 1 ? t('cart.item') : t('cart.items')}</p>
        </motion.div>

        <div className="cart__layout">
          {/* Cart Items */}
          <div className="cart__items">
            {items.map((item, i) => {
              const ti = getTranslatedProduct(item, language);
              return (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <Link to={`/product/${item.slug}`} className="cart-item__image-wrap">
                    <img
                      src={getProductThumb(item.id)}
                      alt={ti.name}
                      className="cart-item__image"
                    />
                  </Link>

                  <div className="cart-item__info">
                    <div className="cart-item__header">
                      <Link to={`/product/${item.slug}`} className="cart-item__name">
                        {ti.name}
                      </Link>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${ti.name} from cart`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="cart-item__footer">
                      <QuantitySelector
                        quantity={item.quantity}
                        max={item.availableQty}
                        onChange={(qty) => updateQuantity(item.id, qty)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <motion.div
            className="cart__summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="cart__summary-card">
              <h3>{t('cart.orderSummary')}</h3>

              <div className="cart__summary-rows">
                <div className="cart__summary-row">
                  <span>{t('cart.items')}</span>
                  <span>{items.length}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                {t('cart.checkout')}
              </Link>

              <Link to="/products" className="cart__continue-shopping">
                {t('cart.continueShopping')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
