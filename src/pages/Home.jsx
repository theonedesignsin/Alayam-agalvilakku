import HeroSection from '../components/sections/HeroSection';
import FeaturedProduct from '../components/sections/FeaturedProduct';
import HeritageSection from '../components/sections/HeritageSection';
import CategorySection from '../components/sections/CategorySection';
import WhyAlayam from '../components/sections/WhyAlayam';
import OccasionSection from '../components/sections/OccasionSection';
import FinalCTA from '../components/sections/FinalCTA';
import LocalSeoSection from '../components/sections/LocalSeoSection';
import Seo from '../components/Seo';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <Seo
        title="Agal Vilakku, Handmade Clay Diya & Pooja Products in Virudhachalam, Cuddalore | Alayam"
        description="Alayam Pooja Products, Virudhachalam – handmade agal vilakku, terracotta diya lamps and pooja items for Deepavali, Karthigai Deepam and gifting. Serving Cuddalore, Tamil Nadu and all India."
        path="/"
      />
      <HeroSection />
      <FeaturedProduct />
      <CategorySection />
      <HeritageSection />
      <WhyAlayam />
      <OccasionSection />
      <LocalSeoSection />
      <FinalCTA />
    </div>
  );
}
