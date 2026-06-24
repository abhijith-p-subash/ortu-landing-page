import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HeroSection from './components/sections/HeroSection';
import DifferentiatorsSection from './components/sections/DifferentiatorsSection';
import FeaturesSection from './components/sections/FeaturesSection';
import ShortcutsSection from './components/sections/ShortcutsSection';
import ComparisonSection from './components/sections/ComparisonSection';
import DonationSection from './components/sections/DonationSection';
import InstallSection from './components/sections/InstallSection';
import FaqSection from './components/sections/FaqSection';

const App = () => {
  return (
    <div id="top" className="min-h-screen custom-scrollbar bg-bg selection:bg-accent/20 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <DifferentiatorsSection />
        <FeaturesSection />
        <ShortcutsSection />
        <ComparisonSection />
        <InstallSection />
        <FaqSection />
        <DonationSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
