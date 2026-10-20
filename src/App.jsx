import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/ui/LoadingScreen';
import Notification from './components/ui/Notification';
import GoToTop from './components/ui/GoToTop';
import SplashCursor from './components/ui/SplashCursor';
import ScrollProgress from './components/ui/ScrollProgress';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Certifications from './pages/Certifications';
import Gallery from './pages/Gallery';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import useUIStore from './store/uiStore';

/* Cart and checkout are private pages: keep them out of Google */
const NoIndex = ({ children }) => (
  <>
    <meta name="robots" content="noindex, nofollow" />
    {children}
  </>
);

/* Jump to the top on every route change (instantly, not an animated scroll) */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const isLoading = useUIStore((state) => state.isLoading);
  const setLoading = useUIStore((state) => state.setLoading);
  const handleLoadingComplete = useCallback(() => setLoading(false), [setLoading]);

  return (
    <>
      <ScrollProgress />
      {/* Fluid splash that follows the cursor / finger (ReactBits) */}
      <SplashCursor />
      {/* The site renders underneath so it is already visible behind the opening doors */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/certifications" element={<Certifications />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/cart" element={<NoIndex><Cart /></NoIndex>} />
          <Route path="/checkout" element={<NoIndex><Checkout /></NoIndex>} />
        </Routes>
      </main>
      <Footer />
      <Notification />
      <GoToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
