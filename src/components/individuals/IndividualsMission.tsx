import { motion } from 'framer-motion';

const IndividualsMission = () => {
  return (
    <section 
      className="relative py-32 px-6 overflow-hidden bg-[#FFFDF2] flex flex-col items-center justify-center text-center md:max-h-[90vh] max-h-[60vh]"
      style={{ 
        backgroundImage: 'url("/images/homepage/grain-pattern.svg")',
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
        <motion.p 
          initial={{ opacity: 0, y: 10, rotate: 2 }} 
          whileInView={{ opacity: 1, y: 0, rotate: 2 }} 
          transition={{ delay: 0.5 }}         
          className="flex flex-col md:text-[3rem] text-[1.94rem] text-[#FFFFFF] max-w-[33.11rem] text-center leading-tight relative z-10 p-[2rem] px-[3rem] md:mt-[2rem] mt-[1rem] -rotate-2"
        >
            Get meals at up to 70% less than regular prices
        </motion.p>
      </motion.div>
    </section>
  );
};

export default IndividualsMission;