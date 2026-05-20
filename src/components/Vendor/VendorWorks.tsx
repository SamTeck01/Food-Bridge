import { motion } from 'framer-motion';

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
};

const VendorWorks = () => {
  return (
    <section className="md:py-[6.19rem] py-[4.3rem] md:px-14 px-[1.25rem] bg-[#FFFDF2]">
        <div className="max-w-[77.5rem] mx-auto text-center">
            <div className='max-w-[24.3rem] mx-auto'>
                <h2 className="md:text-[3rem] text-[2.5rem] text-[#0A2623]">Simple for everyone involved</h2>
                <p className="text-[#0A2623B2] mb-12 mx-auto">
                    Whether you're posting food or finding it, the process is effortless.
                </p>                
            </div>

            {/* Recipients Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {content.restaurants.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
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
                                whileHover={{ scale: 1.05 }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default VendorWorks;