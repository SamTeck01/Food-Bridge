import React from 'react';
import { motion } from 'framer-motion';

// Defining the type for our goal data
interface Goal {
  id: number;
  title: string;
  imageSrc: string;
}

const goals: Goal[] = [
  { id: 1, title: 'Lower environmental impact', imageSrc: '/images/About/goal-shape-1.svg' },
  { id: 2, title: 'Make food more affordable', imageSrc: '/images/About/goal-shape-2.svg' },
  { id: 3, title: 'Enable community support', imageSrc: '/images/About/goal-shape-3.svg' },
  { id: 4, title: 'Reduce food waste across cities', imageSrc: '/images/About/goal-shape-4.svg' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AboutImpactGoals: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-[#0A2521]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-[48px] font-normal mb-10">Our Impact Goals</h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
      >
        {goals.map((goal) => (
          <motion.div 
            key={goal.id} 
            variants={itemVariants}
            className="bg-[#E8F8E8] rounded-3xl p-6 h-[380px] relative overflow-hidden flex flex-col hover:shadow-md transition-shadow border-2 border-[#000000 10%]"
          >
            <div className="z-10">
              <img src="/images/About/plus.svg" alt="plussign" />
              <h3 className="font-normal text-[24px] p-4">{goal.title}</h3>
            </div>
            {/* The decorative SVG at the bottom */}
            <img 
              src={goal.imageSrc} 
              alt="" 
              className="absolute bottom-0 right-0 w-[80%] object-contain"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Target Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <span className="text-gray-500 text-[24px] font-normal mb-2 tracking-wide">Our Target</span>
        <div className="relative inline-block">
          <h3 className="text-2xl md:text-3xl font-normal py-4">10,000 meals saved in first year</h3>
          {/* Export the green scribble underline as an SVG from Figma */}
          <img 
            src="/images/About/scribble-underline.svg" 
            alt="underline" 
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default AboutImpactGoals;