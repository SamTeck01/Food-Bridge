import { motion } from 'framer-motion';

const Mission = () => {
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
          className="flex flex-col md:gap-5 gap-4 md:text-[1.5rem] text-[1rem] text-[#FFFFFF] max-w-[30rem] text-start leading-normal relative z-10 p-[2rem] md:mt-[2rem] mt-[1rem] -rotate-2"
        >
          <span>Every day...</span>

          <span>
            Restaurants throw away good food. <br className="md:hidden" /> 
            Families struggle to afford meals.
          </span>

          <span className="font-medium">
            FoodBridge connects both worlds.
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Mission;