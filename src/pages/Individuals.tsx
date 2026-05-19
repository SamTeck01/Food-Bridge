import React from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import CTASection from '../components/homepage/CTASection';
import FAQSection from '../components/homepage/FAQSection';
import IndividualsChatSection from '../components/individuals/IndividualsChatSection';
import IndividualsMission from '../components/individuals/IndividualsMission';
import IndividualWorks from '../components/individuals/individualworks';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
        <div 
            className="relative flex flex-col bg-[#FFFDF2]"
            style={{ 
            minHeight: '80vh'
            }}
        >
            <Navbar />               
        </div>
        <IndividualsChatSection />
        <IndividualWorks />
        <IndividualsMission />
        <div className="px-4 md:px-[3rem]">
            <FAQSection />
        </div>
        <CTASection />
      <Footer />
    </div>
  );
};

export default AboutPage;