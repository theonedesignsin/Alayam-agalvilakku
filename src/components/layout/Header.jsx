import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../store/cartStore';
import useUIStore from '../../store/uiStore';
import { useLanguage } from '../../store/LanguageContext';
import GooeyNav from '../ui/GooeyNav';
import './Header.css';

function CartLink({ count }) {
  return (
    <Link to="/cart" className="header__cart-btn" aria-label={`Cart with ${count} items`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && <span className="header__cart-badge">{count}</span>}
    </Link>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const location = useLocation();
  const itemCount = useCartStore((state) => state.getItemCount());
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setLangOpen(false);
  }, [location, closeMobileMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    if (!langOpen) return undefined;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/products', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/certifications', label: t('nav.certifications') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/cart', label: t('nav.cart') },
  ];

  // Which nav item matches the current page (product pages belong to Shop, checkout to Cart)
  const path = location.pathname;
  const activeNavIndex =
    path === '/' ? 0
      : path.startsWith('/product') ? 1
      : path.startsWith('/about') ? 2
      : path.startsWith('/certifications') ? 3
      : path.startsWith('/gallery') ? 4
      : path.startsWith('/cart') || path.startsWith('/checkout') ? 5
      : -1;

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="header__logo" aria-label={`${t('brand.name')} Home`}>
          <img className="header__logo-img" src="/images/logo-emblem.webp" alt={t('brand.name')} width="56" height="44" />
          <span className="header__logo-titles">
            <span className="header__logo-text">ALAYAM</span>
            <span className="header__logo-since">{t('footer.since')}</span>
          </span>
        </Link>

        {/* Desktop Nav — Gooey Nav (ReactBits): the blob + bubbles follow the current page */}
        <div className="header__nav">
          <GooeyNav items={navLinks} activeIndex={activeNavIndex} />
        </div>

        {/* Desktop Right Actions */}
        <div className="header__right">
          {/* Language Selector */}
          <div className="header__lang" ref={langRef}>
            <button
              className="header__lang-btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              <span className="header__lang-label">{language === 'en' ? 'EN' : 'த'}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  className="header__lang-dropdown liquid-glass-strong"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className={`header__lang-option ${language === 'en' ? 'header__lang-option--active' : ''}`}
                    onClick={() => handleLanguageSelect('en')}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="header__lang-check">✓</span>}
                  </button>
                  <button
                    className={`header__lang-option ${language === 'ta' ? 'header__lang-option--active' : ''}`}
                    onClick={() => handleLanguageSelect('ta')}
                  >
                    <span>தமிழ்</span>
                    {language === 'ta' && <span className="header__lang-check">✓</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <CartLink count={itemCount} />
        </div>

        {/* Mobile Actions */}
        <div className="header__actions">
          <CartLink count={itemCount} />

          <button
            className={`header__hamburger ${isMobileMenuOpen ? 'header__hamburger--open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Tap / swipe anywhere outside the menu to close it */}
      {isMobileMenuOpen && (
        <div
          className="header__backdrop"
          onClick={closeMobileMenu}
          onTouchMove={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="header__mobile-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`header__mobile-link ${location.pathname === link.to ? 'header__mobile-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {/* Mobile language toggle */}
              <div className="header__mobile-lang">
                <button
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => handleLanguageSelect('en')}
                >EN</button>
                <button
                  className={language === 'ta' ? 'active' : ''}
                  onClick={() => handleLanguageSelect('ta')}
                >த</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
