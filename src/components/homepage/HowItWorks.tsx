import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const content = {
    restaurants: [
        {
        id: 1,
        step: '1',
        title: 'Post surplus food',
        description: "Snap a photo and list what's left in under 2 minutes.",
        image: '/images/homepage/how-post.svg',
        bgColor: 'bg-[#E2ECFC]',
        stepColor: 'bg-[#BCEDF4]',
        },
        {
        id: 2,
        step: '2',
        title: 'Set your price',
        description: 'Choose a discount, symbolic price (₦200), or mark it free. You control the value.',
        image: '/images/homepage/how-price.svg',
        bgColor: 'bg-[#FF894D1F]', 
        stepColor: 'bg-[#F1CFC0]',
        },
        {
        id: 3,
        step: '3',
        title: 'Get it picked up',
        description: 'Nearby recipients get notified. They come to collect, no delivery needed. Zero waste.',
        image: '/images/homepage/how-pickup.svg',
        bgColor: 'bg-[#DBF7ED]',
        stepColor: 'bg-[#B5E7AE]',
        },
    ],
    recipients: [
        {
        id: 1,
        step: '1',
        title: 'Browse nearby food',
        description: 'Open FoodBridge and see verified listings within your area updated in real time.',
        image: '/images/homepage/how-browse.svg',
        bgColor: 'bg-[#FFF0E9]', 
        stepColor: 'bg-[#F1CFC0]',
        },
        {
        id: 2,
        step: '2',
        title: 'Claim your meal',
        description: 'Tap to claim. Reserve your portion instantly before it runs out.',
        image: '/images/homepage/how-claim.svg',
        bgColor: 'bg-[#E2ECFC]', 
        stepColor: 'bg-[#BCEDF4]',
        },
        {
        id: 3,
        step: '3',
        title: 'Collect and enjoy',
        description: 'Head to the restaurant at the pickup time. Show your code and take your food home.',
        image: '/images/homepage/how-collect.svg',
        bgColor: 'bg-[#DBF7ED]', 
        stepColor: 'bg-[#B5E7AE]',
        },
    ],
};

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'recipients'>('restaurants');

  return (
    <section className="md:py-11 py-[4.3rem] md:px-14 px-[1.25rem] bg-[#FFFDF2]">
        <div className="max-w-[77.5rem] mx-auto text-center">
            <div className='max-w-[24.3rem] mx-auto'>
                <h2 className="md:text-[3rem] text-[2.5rem] text-[#0A2623]">Simple for everyone involved</h2>
                <p className="text-[#0A2623B2] mb-12 mx-auto">
                    Whether you're posting food or finding it, the process is effortless.
                </p>

                {/* Custom Toggle Switch */}
                <div className="inline-flex p-1 bg-[#7AD37114] rounded-full mb-[3.75rem] relative border border-[#0F39340D]">
                {/* Restaurants Button */}
                <button
                    onClick={() => setActiveTab('restaurants')}
                    className={`relative px-8 py-3 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                    activeTab === 'restaurants' ? 'text-white' : 'text-[#0A2623B2]'
                    }`}
                >
                    <span className="relative z-20">Restaurants</span>
                    {activeTab === 'restaurants' && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#0F3934] rounded-full z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                    )}
                </button>

                {/* Recipients Button */}
                <button
                    onClick={() => setActiveTab('recipients')}
                    className={`relative px-8 py-3 rounded-full text-sm font-medium transition-colors duration-300 z-10 ${
                    activeTab === 'recipients' ? 'text-white' : 'text-[#0A2623B2]'
                    }`}
                >
                    <span className="relative z-20">Recipients</span>
                    {activeTab === 'recipients' && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#0F3934] rounded-full z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                    )}
                </button>
                </div>
                
            </div>

            {/* Animated Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="wait">
                    {content[activeTab].map((item, index) => (
                    <motion.div
                        key={`${activeTab}-${item.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        // Interaction Animations
                        whileHover={{ 
                        y: -8, 
                        transition: { duration: 0.2 } 
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex flex-col h-full bg-[#FFFDF2] border-2 border-[#0000001A] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md hover:border-[#0F393433] transition-colors duration-300 group"
                    >
                        <div className="p-[2.5rem] text-left flex-1">
                        <div className={`w-10 h-10 ${item.stepColor} rounded-full flex items-center justify-center text-[#0A2623] font-medium mb-6 transition-transform duration-300 group-hover:scale-110`}>
                            {item.step}
                        </div>
                        <h3 className="text-2xl text-[#0A2623] mb-2">{item.title}</h3>
                        <p className="text-[#0A2623B2] leading-relaxed">{item.description}</p>
                        </div>
                            
                        <div className={`h-[12.5rem] ${item.bgColor} flex items-center justify-center p-8 overflow-hidden`}>
                        <motion.img 
                            src={item.image} 
                            alt={item.title} 
                            className="max-h-full object-contain"
                            // Subtle image lift on hover
                            whileHover={{ scale: 1.05 }}
                        />
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    </section>
  );
};

export default HowItWorks;