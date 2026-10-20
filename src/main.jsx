import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './store/LanguageContext';
import App from './App';
import './styles/index.css';

// Static SEO tags (for crawlers without JS) are replaced by the React-rendered ones
document.querySelectorAll('[data-seo-static]').forEach((el) => el.remove());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
