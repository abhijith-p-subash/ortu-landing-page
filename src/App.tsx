import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import DonationSection from './components/sections/DonationSection';

const App = () => {
  return (
    <div className="min-h-screen custom-scrollbar bg-primary selection:bg-accent/20 selection:text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DonationSection />
      <Footer />
    </div>
  );
};

export default App;
