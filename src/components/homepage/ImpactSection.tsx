import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Stats data
const stats = [
  { label: 'Cities', value: 8, suffix: '' },
  { label: 'Restaurants', value: 340, suffix: '+' },
  { label: 'Meals Rescued', value: 12500, suffix: '+' },
];

// Ticker features
const features = [
  { label: "Freshly Prepared Meals", icon: "star.svg" },
  { label: "Surplus Food Available Daily", icon: "sparkle.svg" },
  { label: "Easy Online Claim Process", icon: "plus.svg" },
  { label: "Eco-Friendly Packaging", icon: "leaf.svg" },
  { label: "Trusted by Local Communities", icon: "heart.svg" },
  { label: "Real-Time Availability Updates", icon: "bolt.svg" }
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2; // seconds
      const increment = end / (60 * duration);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const ImpactSection = () => {
  return (
    <section className="bg-[#0F3934] md:py-24 py-[4.9rem] overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-[2.8rem] md:px-[7.5rem]">
            {/* Header and Stats Flexbox */}
            <div className="flex flex-row flex-wrap justify-between items-start md:items-center md:mb-[5.6rem] mb-[2.5rem] gap-y-8">
                {/* Heading*/}
                <h2 className="text-[2.5rem] md:text-[3rem] text-white leading-[1.1] max-w-[12rem] md:max-w-[15rem] text-left">
                    Made to impact all.
                </h2>
                {/* Stats Container*/}
                <div className="flex flex-col md:flex-row items-end md:items-start gap-8 md:gap-16 ml-auto">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-right md:text-left">
                            <div className="text-[2.5rem] md:text-[3.75rem] text-white font-normal leading-none mb-1">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <span className="text-white/60 text-[0.875rem] md:text-[1rem] uppercase tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Horizontal Auto-Scrolling Ticker */}
            <div className="relative md:mb-[5.6rem] mb-[3.75rem] -mx-20">
                <div className="flex space-x-[0.75rem] animate-scroll whitespace-nowrap">
                    {[...features, ...features].map((feature, i) => (
                    <div 
                        key={i} 
                        className="px-8 py-[0.59rem] rounded-[5px] border border-[#FFFFFF1A] bg-[#FFFFFF1A] text-[#FFFFFF] text-sm md:text-base flex items-center gap-[0.625rem]"
                    >
                        <img 
                            src={`/images/homepage/${feature.icon}`} 
                            alt="" 
                            className="w-5 h-5 object-contain" 
                        />
                        <span className="font-light">{feature.label}</span>
                    </div>
                    ))}
                </div>
            </div>

            {/*Impact Images */}
            <div className="flex md:grid md:grid-cols-12 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 scrollbar-hide">
                {/*Bowl Group */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[85%] md:min-w-0 md:col-span-4 aspect-square rounded-[1.46rem] overflow-hidden snap-center"
                >
                    <img src="/images/homepage/impact-1.svg" alt="Bowls" className="w-full h-full object-cover" />
                </motion.div>
                {/*Mascot Peek */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[85%] md:min-w-0 md:col-span-4 rounded-[1.46rem] relative flex items-end justify-center snap-center"
                >
                    <img src="/images/homepage/impact-2.svg" alt="Process" className="w-full h-full object-cover rounded-[1.46rem]" />
                </motion.div>
                {/*Chef/Packaging */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[85%] md:min-w-0 md:col-span-4 md:row-span-2 rounded-[1.46rem] overflow-hidden snap-center bg-[#E3F6F0]"
                >
                    <img src="/images/homepage/impact-3.svg" alt="Chef" className="w-full h-full object-cover" />
                </motion.div>

                {/* Bottom Left*/}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[85%] md:min-w-0 md:col-span-4 bg-[#274C48] rounded-[1.46rem] p-8 flex flex-col justify-center snap-center"
                >
                    <img src="/images/homepage/impact-4.svg" alt="Search" className="w-full h-full object-cover" />
                </motion.div>

                {/* Bottom Middle: Single Bowl */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="min-w-[85%] md:min-w-0 md:col-span-4 bg-[#274C48] rounded-[1.46rem] overflow-hidden snap-center flex items-center justify-center p-10"
                >
                    <img src="/images/homepage/impact-5.svg" alt="Bowl" className="w-full h-full object-contain" />
                </motion.div>

            </div>
        </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ImpactSection;