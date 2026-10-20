import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';
import { getProductThumb } from '../utils/productImages';
import { getTranslatedProduct } from '../data/productTranslations';
import { useLanguage } from '../store/LanguageContext';
import { WHATSAPP_BUSINESS_NUMBER } from '../config';
import './Checkout.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { t, language } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="checkout checkout--empty">
        <div className="container">
          <h2>{t('checkout.noItems')}</h2>
          <p>{t('checkout.noItemsDesc')}</p>
          <Link to="/products" className="btn btn-primary">{t('cart.browseLamps')}</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!form.phone.trim()) newErrors.phone = t('validation.phoneRequired');
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = t('validation.phoneInvalid');
    if (!form.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = t('validation.emailInvalid');
    if (!form.address.trim()) newErrors.address = t('validation.addressRequired');
    if (!form.city.trim()) newErrors.city = t('validation.cityRequired');
    if (!form.state) newErrors.state = t('validation.stateRequired');
    if (!form.pincode.trim()) newErrors.pincode = t('validation.pincodeRequired');
    else if (!/^\d{6}$/.test(form.pincode.trim())) newErrors.pincode = t('validation.pincodeInvalid');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppMessage = () => {
    const lines = [];
    lines.push('🛍️ *NEW ORDER*');
    lines.push('');
    lines.push('📦 *Products:*');

    items.forEach((item) => {
      lines.push(`Product: ${item.name}`);
      lines.push(`Quantity: ${item.quantity}`);
      if (item.shortDescription) {
        lines.push(`Details: ${item.shortDescription}`);
      }
      lines.push('');
    });

    lines.push('👤 *Customer Details:*');
    lines.push(`Name: ${form.name}`);
    lines.push(`Phone: ${form.phone}`);
    if (form.email.trim()) {
      lines.push(`Email: ${form.email}`);
    }
    lines.push('');
    lines.push('📍 *Delivery Address:*');
    lines.push(form.address);
    lines.push(`${form.city}, ${form.state} - ${form.pincode}`);

    return lines.join('\n');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const message = buildWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    setShowSuccess(true);
    clearCart();
  };

  if (showSuccess) {
    return (
      <div className="checkout checkout--success">
        <div className="container">
          <motion.div
            className="checkout__success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="checkout__success-icon">🪔</div>
            <h2>{t('checkout.success')}</h2>
            <p>{t('checkout.thankYou')} <strong>{form.name}</strong>!</p>
            <p>
              {t('checkout.successMsg')} <strong>{form.email}</strong>.
            </p>
            <div className="checkout__success-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                {t('checkout.continueShopping')}
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg">
                {t('checkout.backHome')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="checkout__title">{t('checkout.title')}</h1>
        </motion.div>

        <form className="checkout__layout" onSubmit={handleSubmit} noValidate>
          {/* Form */}
          <motion.div
            className="checkout__form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="checkout__section-title">{t('checkout.deliveryInfo')}</h3>

            <div className="checkout__form-grid">
              <div className={`input-group ${errors.name ? 'input-group--error' : ''}`}>
                <label htmlFor="name">{t('checkout.fullName')} *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('checkout.fullName')}
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="input-error">{errors.name}</span>}
              </div>

              <div className={`input-group ${errors.phone ? 'input-group--error' : ''}`}>
                <label htmlFor="phone">{t('checkout.phone')} *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="input-error">{errors.phone}</span>}
              </div>

              <div className={`input-group checkout__full-width ${errors.email ? 'input-group--error' : ''}`}>
                <label htmlFor="email">{t('checkout.email')} *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="input-error">{errors.email}</span>}
              </div>

              <div className={`input-group checkout__full-width ${errors.address ? 'input-group--error' : ''}`}>
                <label htmlFor="address">{t('checkout.address')} *</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  placeholder={t('checkout.address')}
                  value={form.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="input-error">{errors.address}</span>}
              </div>

              <div className={`input-group ${errors.city ? 'input-group--error' : ''}`}>
                <label htmlFor="city">{t('checkout.city')} *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder={t('checkout.city')}
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="input-error">{errors.city}</span>}
              </div>

              <div className={`input-group ${errors.state ? 'input-group--error' : ''}`}>
                <label htmlFor="state">{t('checkout.state')} *</label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">{t('checkout.selectState')}</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <span className="input-error">{errors.state}</span>}
              </div>

              <div className={`input-group ${errors.pincode ? 'input-group--error' : ''}`}>
                <label htmlFor="pincode">{t('checkout.pincode')} *</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder={t('checkout.pincode')}
                  value={form.pincode}
                  onChange={handleChange}
                  maxLength={6}
                />
                {errors.pincode && <span className="input-error">{errors.pincode}</span>}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="checkout__summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="checkout__summary-card">
              <h3>{t('cart.orderSummary')}</h3>

              <div className="checkout__items">
                {items.map((item) => {
                  const ti = getTranslatedProduct(item, language);
                  return (
                    <div key={item.id} className="checkout__item">
                      <img
                        src={getProductThumb(item.id)}
                        alt={ti.name}
                        className="checkout__item-image"
                        width="50"
                        height="50"
                        decoding="async"
                      />
                      <div className="checkout__item-info">
                        <span className="checkout__item-name">{ti.name}</span>
                        <span className="checkout__item-qty">{t('product.quantity')}: {item.quantity}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout__totals">
                <div className="checkout__total-row">
                  <span>{t('cart.items')}</span>
                  <span>{items.length}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t('checkout.sendWhatsApp')}
              </button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
