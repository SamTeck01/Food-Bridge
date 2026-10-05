import { motion } from 'framer-motion';
import FeatureTicker from '../homepage/FeatureTicker';
import { Sparkles } from 'lucide-react';
import React from 'react';

const AboutProblemSolution: React.FC = () => {

  return (
    // The dark green wrapper with the huge rounded top corners
    <section className="bg-[#0A2521] rounded-t-[3rem] md:rounded-t-[4rem] pt-24 md:pt-28 pb-6 overflow-hidden">
      <div className="max-w-[63rem] mx-auto px-6 mb-12">
        
        {/* The 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. The Problem Text Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#15342D] border border-[#1E453C] rounded-2xl overflow-hidden order-1"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-[#1E453C]/60 border-b border-[#1E453C]">
              <img src="/images/homepage/plus.svg" alt="star icon" />
              <h3 className="text-xl text-white">The Problem</h3>
            </div>
            <div className="space-y-4 text-white/80 text-sm leading-relaxed p-6">
              <p>Every night...</p>
              <p>Restaurants throw away perfectly good meals.</p>
              <p>At the same time...</p>
              <p>Families struggle to afford food.</p>
              <p>This isn't a food problem.</p>
              <p>It's a connection problem.</p>
            </div>
          </motion.div>

          {/* 2. Top Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden relative min-h-[260px] order-2"
          >
            {/* Export this specific image with its green overlay as a single PNG/SVG from Figma */}
            <img 
              src="/images/About/problem-hands.svg" 
              alt="Hands holding food bowl" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* 3. Bottom Left Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            // Notice order-4 on mobile, order-3 on desktop
            className="rounded-2xl overflow-hidden relative min-h-[260px] order-4 md:order-3"
          >
            {/* Export this specific image with the green blob as a single PNG/SVG from Figma */}
            <img 
              src="/images/About/solution-packaging.svg" 
              alt="Packaging food" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* 4. The Solution Text Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            // Notice order-3 on mobile, order-4 on desktop
            className="bg-[#15342D] border border-[#1E453C] rounded-2xl overflow-hidden order-3 md:order-4"
          >
            <div className="flex items-center gap-3 px-6 py-4 bg-[#1E453C]/60 border-b border-[#1E453C]">
              <Sparkles className="text-green-400 fill-green-400" size={24} />
              <h3 className="text-xl text-white">Our Solution</h3>
            </div>
            <div className="space-y-4 text-white/80 text-sm leading-relaxed p-6">
              <p>FoodBridge connects surplus food to people who need it.</p>
              <p>Restaurants list leftover food in seconds.</p>
              <p>People nearby claim it at a reduced price or for free.</p>
              <p>Simple. Fast. Impactful.</p>
            </div>
          </motion.div>

        </div>
      </div>

      <FeatureTicker />
    </section>
  );
};

export default AboutProblemSolution;