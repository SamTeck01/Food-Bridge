import { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import AudienceSection from '../components/homepage/AudienceSection';
import CTASection from '../components/homepage/CTASection';
import FAQSection from '../components/homepage/FAQSection';
import Hero from '../components/homepage/Hero';
import HowItWorks from '../components/homepage/HowItWorks';
import ImpactSection from '../components/homepage/ImpactSection';
import Mission from '../components/homepage/Mission';
import Navbar from '../components/Navbar';


import type { Listing } from '../services/listings.service';
import { getListings } from '../services/listings.service';

const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings(3).then(setListings).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
      <div 
        className="relative flex flex-col bg-bottom bg-no-repeat bg-contain lg:bg-cover"
        style={{ 
          backgroundImage: 'url("/images/homepage/hero-main.svg")',
          minHeight: '80vh'
        }}
      >
        <Navbar />
        <div className="h-12 lg:h-[4.9rem]" /> 
        <Hero />
      </div>
      
      <main>
        <Mission />
        <AudienceSection />
        <HowItWorks />
        <ImpactSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;