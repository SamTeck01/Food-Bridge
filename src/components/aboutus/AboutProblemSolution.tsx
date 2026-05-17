import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Leaf, ShieldCheck, Clock } from 'lucide-react';

const AboutProblemSolution: React.FC = () => {
  // Array for the scrolling marquee at the bottom
  const bannerItems = [
    { text: "Freshly Prepared Meals", icon: <Star size={16} className="text-gray-400" /> },
    { text: "Surplus Food Available Daily", icon: <Star size={16} className="text-red-400" /> },
    { text: "Easy Online Claim Process", icon: <Star size={16} className="text-orange-400" /> },
    { text: "Eco-Friendly Packaging", icon: <Leaf size={16} className="text-purple-400" /> },
    { text: "Trusted by Local Communities", icon: <ShieldCheck size={16} className="text-green-400" /> },
    { text: "Real-Time Updates", icon: <Clock size={16} className="text-blue-400" /> },
  ];

  return (
    // The dark green wrapper with the huge rounded top corners
    <section className="bg-[#0A2521] rounded-t-[3rem] md:rounded-t-[4rem] pt-20 pb-6 overflow-hidden mt-12">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        
        {/* The 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. The Problem Text Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#15342D] border border-[#1E453C] p-8 md:p-12 rounded-3xl order-1"
          >
            <div className="flex items-center gap-3 mb-8">
              <img src="/images/homepage/plus.svg" alt="star icon" />
              <h3 className="text-2xl font-semibold text-white">The Problem</h3>
            </div>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
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
            className="rounded-3xl overflow-hidden relative min-h-[300px] order-2"
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
            className="rounded-3xl overflow-hidden relative min-h-[300px] order-4 md:order-3"
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
            className="bg-[#15342D] border border-[#1E453C] p-8 md:p-12 rounded-3xl order-3 md:order-4"
          >
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-green-400 fill-green-400" size={24} />
              <h3 className="text-2xl font-semibold text-white">Our Solution</h3>
            </div>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>FoodBridge connects surplus food to people who need it.</p>
              <p>Restaurants list leftover food in seconds.</p>
              <p>People nearby claim it at a reduced price or for free.</p>
              <p>Simple. Fast. Impactful.</p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* The Scrolling Banner (Marquee) */}
      <div className="relative flex overflow-hidden border-t border-b border-[#1E453C] py-4 bg-[#0A2521]">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 20, repeat: Infinity }}
        >
          {/* We duplicate the array twice so the infinite scroll loops seamlessly */}
          {[...bannerItems, ...bannerItems].map((item, index) => (
            <div key={index} className="flex items-center gap-2 mx-6">
              <div className="bg-[#15342D] p-2 rounded-lg border border-[#1E453C] flex items-center gap-3 px-4">
                {item.icon}
                <span className="text-gray-300 text-sm font-medium">{item.text}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutProblemSolution;