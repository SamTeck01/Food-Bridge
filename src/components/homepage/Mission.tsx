import { motion } from 'framer-motion';

const Mission = () => {
  return (
    <section 
      className="relative py-32 px-6 overflow-hidden bg-[#FFFDF2] flex flex-col items-center justify-center text-center"
      style={{ 
        backgroundImage: 'url("/images/homepage/grain-pattern.svg")', // Your textured pattern
        backgroundSize: 'cover'
      }}
    >
      {/* Centered Illustration Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center w-full max-w-[56rem]"
      >
        {/* Background Image (The Duck, Lightning, Quote combined) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <img 
            src="/images/homepage/mission-visual-cluster.svg" 
            alt="" 
            className="w-full h-auto max-h-[500px] object-contain opacity-90"
          />
        </div>

        {/* The Actual Text (Overlapping the center of the image) */}
        <div className="relative z-10 py-20">
          <h2 className="text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1] text-[#0A2623] font-normal tracking-tight">
            Feed families, <br />
            <span className="italic font-light opacity-80">not</span> landfills.
          </h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-[1.25rem] text-[#0A2623B2] max-w-[30rem] mx-auto leading-relaxed"
          >
            Turning surplus into impact. Join the mission to bridge the gap between 
            perfectly good food and the people who need it.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};

export default Mission;