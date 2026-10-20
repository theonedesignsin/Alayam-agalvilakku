import { Link } from 'react-router-dom';
import { useLanguage } from '../../store/LanguageContext';
import { WHATSAPP_BUSINESS_NUMBER } from '../../config';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img className="footer__logo-img" src="/images/logo.webp" alt={t('brand.name')} width="140" height="125" loading="lazy" />
            </Link>
            <p className="footer__brand-name">ALAYAM POOJA PRODUCTS</p>
            <p className="footer__since">{t('footer.since')}</p>
            <p className="footer__tagline">
              {t('footer.tagline1')}<br />
              {t('footer.tagline2')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4>{t('footer.quickLinks')}</h4>
            <nav>
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/products">{t('footer.allLamps')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/certifications">{t('nav.certifications')}</Link>
              <Link to="/gallery">{t('nav.gallery')}</Link>
              <Link to="/cart">{t('nav.cart')}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer__section">
            <h4>{t('footer.contact')}</h4>
            <div className="footer__contact">
              <p>📧 alayampoojaproducts@gmail.com</p>
              <p>📞 +{WHATSAPP_BUSINESS_NUMBER}</p>
              <address className="footer__address">
                <span className="footer__address-icon" aria-hidden="true">📍</span>
                <span className="footer__address-text">
                  <strong>V SQUARE MANUFACTURING TRADERS</strong>
                  152/1B,2, MRK Nagar / Aladi Road,<br />
                  Cuddalore, Virudhachalam - 606001<br />
                  Tamil Nadu, India
                </span>
              </address>
              <p className="footer__gstin">GSTIN: 33AMNPV6562D1ZQ</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {t('brand.name')}. {t('footer.copyright')}</p>
          <p className="footer__craft">
            {t('footer.craft')}
          </p>
        </div>
      </div>
    </footer>
  );
}
