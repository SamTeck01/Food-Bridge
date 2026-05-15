import React from 'react';
import { motion } from 'framer-motion';

const AboutHero: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
      {/* Label: "About FoodBridge" */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[#4A5568] text-lg md:text-xl font-medium mb-4"
      >
        About FoodBridge
      </motion.span>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-[#0D1B1E] text-5xl md:text-[100px] font-normal tracking-tight mb-12 leading-[90%]"
      >
        Here’s who <br className="hidden md:block" /> we are...
      </motion.h1>

      {/* SVG Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.4,
          type: "spring",
          stiffness: 100 
        }}
        className="w-full max-w-[400px] md:max-w-[500px]"
      >
        {/* Replace 'noodle-box.svg' with your actual exported file path */}
        <img 
          src="/images/About/noodle-box.svg" 
          alt="Noodle Illustration" 
          className="w-[287.21px] h-[300px] drop-shadow-sm mx-auto"
        />
      </motion.div>
    </section>
  );
};

export default AboutHero;