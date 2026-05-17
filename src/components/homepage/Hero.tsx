import { motion } from 'framer-motion';
import { MapPin, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto text-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Main Heading */}
          <h1 className="text-[3rem] lg:text-[5.5rem] leading-[1.05] font-normal text-[#0A2623] mb-4">
            Good Food <br />
            Shouldn’t Go <br />
            to Waste.
          </h1>
          <p className="text-[1.5rem] text-[#0A2623B2] max-w-[40.3rem] mb-[1.25rem] leading-relaxed font-normal">
            Turn surplus meals into affordable food for people nearby.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center md:mt-8 mt-4">
            <Link 
              to="/get-started" 
              className="px-5 py-4 bg-[#0F3934] text-white rounded-full text-[1rem] font-light hover:bg-[#1A4A3F] hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
            >
              List surplus food
              <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/listings" 
              className="px-5 py-4 border border-[#0F393440] bg-white/50 backdrop-blur-sm text-[#0A2623] rounded-full text-[1rem] font-light hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <MapPin size={16} className="text-[#0F3934]" />
              Find food near you
            </Link>
          </div>
        </motion.div>
        
      </div>
      <img src="/images/homepage/hero-bottom.svg" alt="" />
    </section>
  );
};

export default Hero;