import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const audiences = [
  {
    id: 'vendors',
    title: 'Vendors',
    subtitle: 'Turn surplus into value',
    color: 'bg-[#E6F7E5]',
    textColor: 'text-[#0A2623]',
    image: '/images/homepage/vendor-bowl.svg', 
  },
  {
    id: 'individuals',
    title: 'Individuals',
    subtitle: 'Access affordable meals near you',
    color: 'bg-[#FAF2D6]',
    textColor: 'text-[#0A2623]',
    image: '/images/homepage/noodle-box.svg',
  },
  {
    id: 'sponsors',
    title: 'Sponsors',
    subtitle: 'Feed others with transparency',
    color: 'bg-[#DCEBFC]',
    textColor: 'text-[#0A2623]',
    image: '/images/homepage/coffee-waffle.svg',
  },
  {
    id: 'pets',
    title: 'Pet Owners',
    subtitle: 'Access usable food by-products',
    color: 'bg-[#FFE9E9]', 
    textColor: 'text-[#0A2623]',
    image: '/images/homepage/dog-illustration.svg',
  },
];

const AudienceSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>('vendors');

  return (
    <section className="md:py-24 py-[4.3rem] md:px-14 px-[1.25rem] bg-[#FFFDF2]">
        <div className="max-w-[77.5rem] mx-auto">
            <div className="text-center mb-14">
                <h2 className="md:text-[3rem] text-[2.5rem] font-medium text-[#0A2623]">Who is it for?</h2>
                <p className="text-[#0A2623B2] max-w-sm mx-auto">
                    FoodBridge connects vendors, individuals, sponsors, and pet owners to create a thriving community.
                </p>
            </div>

            {/* The Dynamic Grid Container */}
            <div className="flex flex-col lg:flex-row md:gap-4 gap-[1.25rem] h-auto lg:h-[600px]">
                {audiences.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                    <motion.div
                        key={item.id}
                        layout
                        onClick={() => setExpandedId(item.id)}
                        onMouseEnter={() => window.innerWidth > 1024 && setExpandedId(item.id)}
                        className={`relative cursor-pointer overflow-hidden md:rounded-[1.5rem] rounded-[1rem] md:p-[3.125rem] p-[1.8rem] flex flex-col transition-colors duration-500 border-2 border-[#0000001A] ${item.color} ${
                        isExpanded ? 'flex-[4]' : 'flex-[1]'
                        }`}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Header Content */}
                        <div className={`flex justify-between ${isExpanded ? 'flex-col items-start' : 'lg:flex-col items-center lg:justify-between h-full'}`}>
                            <div className={`${!isExpanded && 'lg:rotate-180 lg:[writing-mode:vertical-lr]'} transition-all duration-500`}>
                                <h3 className={`text-[2.5rem] font-medium ${item.textColor} whitespace-nowrap`}>
                                    {item.title}
                                </h3>
                                {isExpanded && (
                                <motion.p 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="text-[#0A2623B2]"
                                >
                                    {item.subtitle}
                                </motion.p>
                                )}
                            </div>
                        
                            {/* Icon/Image that shows when collapsed */}
                            {!isExpanded && (
                                <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-12 h-12 lg:size-[4.375rem] object-contain mt-4 lg:mt-0" 
                                />
                            )}
                        </div>

                        {/* Large Image/Illustration for Expanded View */}
                        <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="mt-auto flex justify-center items-center h-full max-h-[18.75rem]"
                            >
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-contain max-w-[400px]"
                            />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
  );
};

export default AudienceSection;