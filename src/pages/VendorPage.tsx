import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VendorHero from '../components/Vendor/VendorHero';
import VendorReason from '../components/Vendor/VendorReason';
import VendorWorks from '../components/Vendor/VendorWorks';
import VendorMission from '../components/Vendor/VendorMisssion';
import CTASection from '../components/homepage/CTASection';
import FAQSection from '../components/homepage/FAQSection';
import VendorChatSection from '../components/Vendor/VendorChatSection';

const VendorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
        <div 
            className="relative flex flex-col bg-[#FFFDF2]"
            style={{ 
            minHeight: '80vh'
            }}
        >
            <Navbar />
            <VendorHero />               
        </div>
        <VendorChatSection />
        <VendorReason />
        <VendorWorks />
        <VendorMission />
        <div className="px-4 md:px-[3rem]">
            <FAQSection />
        </div>
        <CTASection />

      <Footer />
    </div>
  );
};

export default VendorPage;


