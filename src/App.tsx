import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import FeaturesSection from './components/sections/FeaturesSection';
import DonationSection from './components/sections/DonationSection';
import InstallSection from './components/sections/InstallSection';
import FaqSection from './components/sections/FaqSection';

const App = () => {
  return (
    <div className="min-h-screen custom-scrollbar bg-primary selection:bg-accent/20 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <InstallSection />
        <FaqSection />
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
