import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-[77.5rem] mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left"
        >
          <h1 className="text-[3.5rem] lg:text-[4.5rem] leading-[1.1] font-normal text-[#0A2623] mb-6">
            Good food. <br />
            <span className="text-[#0A2623]/40">Wrong timing.</span> <br />
            Right home.
          </h1>
          <p className="text-[1.125rem] text-[#0A2623B2] max-w-[32rem] mb-10 leading-relaxed mx-auto lg:mx-0">
            Connecting surplus meals from your favorite local vendors to your table. 
            Fresh food, lower prices, zero waste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/listings" 
              className="px-10 py-4 bg-[#0F3934] text-white rounded-full text-[16px] font-medium hover:bg-[#1A4A3F] transition-all shadow-xl shadow-[#0F3934]/10"
            >
              Browse Food
            </Link>
            <Link 
              to="/get-started" 
              className="px-10 py-4 border border-[#0000001A] text-[#0A2623] rounded-full text-[16px] font-medium hover:bg-gray-50 transition-all"
            >
              List Your Surplus
            </Link>
          </div>
        </motion.div>

        {/* Right Illustration/Image Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl">
            <img 
              src="/images/homepage/hero-main.svg" 
              alt="FoodBridge Impact" 
              className="w-full h-auto"
            />
          </div>
          {/* Decorative Background Element from Design */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#7AD371]/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;