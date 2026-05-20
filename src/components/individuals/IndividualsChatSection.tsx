import { motion } from 'framer-motion';

const features = [
  { label: "Freshly Prepared Meals", icon: "star.svg" },
  { label: "Surplus Food Available Daily", icon: "sparkle.svg" },
  { label: "Easy Online Claim Process", icon: "plus.svg" },
  { label: "Eco-Friendly Packaging", icon: "leaf.svg" },
  { label: "Trusted by Local Communities", icon: "heart.svg" },
  { label: "Real-Time Availability Updates", icon: "bolt.svg" }
];

const IndividualsChatSection = () => {
  return (
    <section className="w-full relative z-30">
      {/* Main Dark Green Container */}
      <div className="w-full bg-brand-secondary rounded-t-[50px] md:rounded-t-[80px] pt-16 md:pt-24 pb-12 md:pb-16 px-6 md:px-16 overflow-hidden relative shadow-[var(--shadow-xl)]">
        
        {/* Chat Bubbles Container */}
        <div className="max-w-[749px] mx-auto flex flex-col gap-6 md:gap-[1.19rem] mb-20 md:mb-[6.75rem]">
          
          {/* Left Bubble (User) */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="self-start bg-[#FFFFFF1A] backdrop-blur-sm border-2 border-[#FFFFFF1A] rounded-[2rem] rounded-tl-[0.4rem] p-6 md:p-[1.88rem] text-white w-[90%] md:w-[60%]"
          >
            <ul className="text-sm md:text-[1.2rem] font-normal">
              <li className="flex items-center gap-">
                <span className="text-xl">💸</span>
                <p>Food is getting expensive</p>
              </li>
              <li className="flex items-center">
                <span className="text-xl">🍛</span>
                <p>I still want quality meals</p>
              </li>
              <li className="flex items-center">
                <span className="text-xl">⏱️</span>
                <p>And need something quick</p>
              </li>
            </ul>
          </motion.div>

          {/* Right Bubble 1 (System) */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="self-end bg-[#FFFFFF1A] backdrop-blur-sm border-2 border-[#FFFFFF1A] rounded-[4.06rem] rounded-tr-[0.4rem] py-[1.38rem] px-[3.56rem] text-white w-fit"
          >
            <p className="text-sm md:text-[1.2rem] font-normal">We get it...</p>
          </motion.div>

          {/* Right Bubble 2 (System) */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="self-end bg-[#FFFFFF1A] backdrop-blur-sm border-2 border-[#FFFFFF1A] rounded-[4.06rem] rounded-tr-[0.4rem] py-[1.38rem] px-[3.56rem] text-white w-fit"
          >
            <p className="text-sm md:text-[1.2rem] font-normal">FoodBridge makes it easier.</p>
          </motion.div>

        </div>

        {/* Horizontal Auto-Scrolling Ticker */}
        <div className="relative -mx-6 md:-mx-16 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex space-x-[0.75rem] animate-scroll whitespace-nowrap w-max">
            {[...features, ...features, ...features].map((feature, i) => (
              <div 
                key={i} 
                className="px-8 py-[0.59rem] rounded-[5px] border border-white/10 bg-white/5 backdrop-blur-sm text-[#FFFFFF] text-sm md:text-base flex items-center gap-[0.625rem]"
              >
                <img 
                    src={`/images/homepage/${feature.icon}`} 
                    alt="" 
                    className="w-5 h-5 object-contain opacity-80" 
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <span className="font-light">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Styles for the Ticker */}
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-scroll {
            /* Adjust the 40s to make it faster/slower */
            animation: scroll 40s linear infinite; 
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default IndividualsChatSection;