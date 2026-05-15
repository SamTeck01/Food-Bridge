import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: "What is FoodBridge?",
    answer: "FoodBridge is a platform that connects restaurants and food vendors with surplus food to people nearby who can buy it at a discount or receive it for free. Instead of letting good food go to waste, it helps it reach someone who needs it."
  },
  { question: "Is the food safe to eat?", 
    answer: "Absolutely. We only partner with registered food vendors who adhere to strict local health and safety regulations. Every listed meal is surplus from that day's fresh inventory, not expired or spoiled food." },
    { question: "Why is the food so cheap?", 
        answer: "The food is priced at a symbolic or heavily discounted rate because it is surplus. Vendors would rather see it enjoyed by someone at a lower price than have it go to waste at the end of the business day." 
    },
    { question: "How do I get the food after claiming it?", 
        answer: "Once you claim a meal in the app, you will receive a unique digital code. You simply head to the restaurant or vendor location during their specified pickup window, show your code, and collect your food." 
    },
    { question: "Does FoodBridge offer delivery?", 
        answer: "To keep the platform sustainable and the food as affordable as possible, FoodBridge is currently a pickup-only service. This eliminates delivery fees and ensures that 100% of the value goes toward the food and the community." 
    },
    { question: "What happens if I miss the pickup time?", 
        answer: "Because we deal with fresh food and specific business hours, pickup windows are firm. If you miss your window, the vendor may no longer be open or able to hold the food. We recommend claiming only when you are sure you can make it to the location." 
    },
    { question: "Can I get food for free?", 
        answer: "Yes. While many items are listed at a symbolic discount, vendors have the option to mark surplus items as free for anyone who needs them most." 
    },
    { question: "How does payment work?", 
        answer: "Payments are handled securely within the FoodBridge app. When you claim a discounted meal, you pay digitally via our integrated payment gateway, ensuring a seamless and contactless experience when you arrive for pickup." 
    },
  
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[#FFFDF2] py-20 px-6">
      <div className="max-w-[1440px] mx-auto relative">
        
        {/* The Notebook Container */}
        <div className="bg-gradient-to-b from-[#FFFFFF] to-[#F9F9F9] border-[6px] border-[#7AD371] rounded-[1.5rem] shadow-sm relative overflow-hidden min-h-[658px] flex flex-col md:flex-row">
          
            {/* Middle Rings (The Spine) */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[0.75rem] bg-[#7AD371] hidden md:flex flex-col justify-around py-[0.75rem] z-20">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-[4.375rem] h-[1.25rem] bg-[#0F3934] -ml-[1.6rem] flex items-center justify-between px-2"
                    >
                        {/* Left Pin */}
                        <div className="size-[9px] bg-white rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                        
                        {/* Right Pin */}
                        <div className="size-[9px] bg-white rounded-full shadow-[0_1px_1px_rgba(0,0,0,0.3)]" />
                    </div>
                ))}
            </div>

            {/* LEFT PAGE: Questions */}
            <div className="w-full md:w-1/2 p-8 md:p-[2.5rem] border-b md:border-b-0 md:border-r-[3px] border-[#7AD371]/20">
                <h2 className="text-[2.5rem] font-normal pb-[1.5rem] text-[#000000] border-b border-[#0000001A]">FAQs</h2>
                <div>
                    {faqs.map((faq, i) => (
                        <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-full text-left py-[1.375rem] px-2 border-b border-[#0000001A] transition-all flex justify-between items-center group ${
                            activeIndex === i ? "text-[#7AD371]" : "text-[#0A2623]"
                        }`}
                        >
                            <span className="text-lg md:text-base font-normal">{faq.question}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* RIGHT PAGE*/}
            <div className="w-full md:w-1/2 p-8 md:p-[2.5rem] bg-gradient-to-b from-[#FFFFFF] to-[#F9F9F9] flex flex-col">
                <div className="hidden md:block">
                    <h2 className="text-[2.5rem] font-normal pb-[1.5rem] text-[#000000] border-b border-[#0000001A] mb-[1.5rem]">
                        Answer
                    </h2>
                    <AnimatePresence mode="wait">
                        <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="leading-[8rem] text-lg md:text-base font-normal"
                        >
                            {faqs[activeIndex].answer}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Answer view */}
                <div className="md:hidden">
                <p className="text-lg leading-relaxed text-[#1E3A37]/80">
                    {faqs[activeIndex].answer}
                </p>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;