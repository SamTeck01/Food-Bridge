import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VendorHero from '../components/Vendor/VendorHero';
import VendorReason from '../components/Vendor/VendorReason';

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
        <VendorReason />
      <Footer />
    </div>
  );
};

export default VendorPage;


