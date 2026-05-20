import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight01Icon } from 'hugeicons-react';

const VendorHero: React.FC = () => {
  return (
    <section className="relative pt-20 px-6 flex flex-col items-center text-center overflow-visible">
      <div className="max-w-[600px] mx-auto z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[72px] md:text-7xl font-normal text-[#0A2521] leading-tight tracking-tight mb-6"
        >
          Turn Surplus <br className="hidden md:block" /> Food Into Value
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 text-[16px] md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop throwing away meals. Recover costs, reduce waste, and build goodwill in your community.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16"
        >
          <button className="flex items-center gap-2 bg-[#0A2521] text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-all w-full sm:w-auto justify-center group">
            Start Listing Food
            {/* Hugeicon with a slight hover translation for a sleek feel */}
            <ArrowRight01Icon size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-transparent border border-gray-300 text-[#0A2521] px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 transition-all w-full sm:w-auto justify-center">
            See How It Works
          </button>
        </motion.div>
      </div>

      {/* The image container uses negative bottom margins (-mb-24) 
        so it intentionally spills over into the next dark green section.
      */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="relative z-20 w-full max-w-[500px] mx-auto -mb-24 md:-mb-32"
      >
        <img 
          src="/images/Vendor/food-bowl.svg" 
          alt="Branded FoodBridge meal" 
          className="w-full h-auto drop-shadow-2xl"
        />
      </motion.div>
    </section>
  );
};

export default VendorHero;