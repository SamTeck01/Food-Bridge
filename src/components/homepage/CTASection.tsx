import { motion, type Variants } from 'framer-motion';
import { MapPin, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const floatingVariants: Variants = {
    floating: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative w-full py-16 overflow-hidden">
        {/* Split Background Layer */}
        <div className="absolute inset-0 z-0">
            <div className="h-1/2 w-full bg-[#FFFDF2]" /> 
            <div className="h-1/2 w-full bg-[#000000]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
            {/* Main Green Card */}
            <div className="relative bg-[#0F3934] rounded-[1.5rem] p-12 md:p-[6.5rem] overflow-hidden shadow-2xl">
                <motion.div 
                    variants={floatingVariants}
                    animate="floating"
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                    backgroundImage: "url('/images/homepage/cta-background-with-foods.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    }}
                />

                <div className="relative z-20 flex flex-col items-center text-center max-w-[37.69rem] mx-auto">
                    <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-white text-[3rem] md:text-[4.69rem] leading-[1.1] font-normal md:mb-10 mb-5 tracking-tight"
                    >
                        Start using FoodBridge today
                    </motion.h2>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center md:mt-8 mt-4">
                        <Link 
                        to="/get-started" 
                        className="px-5 py-4 bg-[#7AD371] text-[#0A2623] hover:text-white rounded-full text-[1rem] font-light hover:bg-[#1A4A3F] hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
                        >
                            List surplus food
                            <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link 
                        to="/listings" 
                        className="px-5 py-4 border border-[#FFFFFF1A] bg-[#FFFFFF1A] backdrop-blur-sm text-white hover:text-[#0A2623] rounded-full text-[1rem] font-light hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            <MapPin size={16} className="text-[#0F3934]" />
                            Find food near you
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CTASection;