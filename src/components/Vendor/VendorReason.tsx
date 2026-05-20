import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, FavouriteIcon, Shield01Icon, ZapIcon } from 'hugeicons-react';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgShape: string;
}

const benefits: Benefit[] = [
  {
    id: 1,
    title: 'Recover Costs',
    description: 'Sell surplus instead of losing money',
    icon: <StarIcon size={24} className="text-[#3CB371]" />, 
    bgShape: '/images/Vendor/reason-1.svg'
  },
  {
    id: 2,
    title: 'Reduce Waste',
    description: 'Turn leftovers into impact',
    icon: <FavouriteIcon size={24} className="text-[#3CB371]" />, 
    bgShape: '/images/Vendor/reason-2.svg'
  },
  {
    id: 3,
    title: 'Build Reputation',
    description: 'Show your customers you care',
    icon: <Shield01Icon size={24} className="text-[#3CB371]" />, 
    bgShape: '/images/Vendor/reason-3.svg'
  },
  {
    id: 4,
    title: 'Fast & Easy',
    description: 'Post listings in under a minute',
    icon: <ZapIcon size={24} className="text-[#3CB371]" />, 
    bgShape: '/images/Vendor/reason-4.svg'
  }
];

const VendorWhyUse: React.FC = () => {
  return (
    // Notice there is no horizontal padding (px) here so the scroll bleeds to the edges
    <section className="py-24 bg-[#FDFCF7] overflow-hidden flex flex-col items-center">
      
      {/* Heading Container still needs padding so it doesn't touch the screen edges on mobile */}
      <div className="text-center px-6 mb-16">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-medium text-[#0A2521] tracking-tight"
        >
          Why vendors use <br className="hidden md:block" /> FoodBridge
        </motion.h2>
      </div>

      {/* The Autoscroll Container */}
      <div className="relative w-full flex group">
        <motion.div 
          className="flex gap-6 whitespace-nowrap pl-6"
          // We scroll to -50% because we are duplicating the array below to create a seamless infinite loop
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            ease: "linear", 
            duration: 15, // Lower number = faster scroll
            repeat: Infinity 
          }}
          // This creates the pause on hover effect
          whileHover={{ animationPlayState: "paused" }}
        >
          {[...benefits, ...benefits].map((benefit, index) => (
            <div 
              key={index} 
              className="w-[280px] md:w-[320px] h-[360px] flex-shrink-0 bg-[#EAF3EC] rounded-3xl p-8 flex flex-col relative overflow-hidden transition-transform hover:scale-[1.02] cursor-grab active:cursor-grabbing shadow-sm"
            >
              {/* Card Header Content */}
              <div className="relative z-10">
                <div className="mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-medium text-[#0A2521] mb-2 whitespace-normal">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 whitespace-normal text-sm md:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Bottom Decorative Graphic */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-end">
                <img 
                  src={benefit.bgShape} 
                  alt="" 
                  className="w-full object-cover origin-bottom"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VendorWhyUse;