import { motion } from 'framer-motion';

const features = [
  {
    title: "Eco-Friendly",
    desc: "Reducing CO2 emissions by preventing food rot in landfills.",
    icon: "/images/icons/eco.svg"
  },
  {
    title: "Cost Effective",
    desc: "Get premium meals at a fraction of the regular retail price.",
    icon: "/images/icons/wallet.svg"
  },
  {
    title: "Community Driven",
    desc: "Support local vendors while feeding your neighborhood.",
    icon: "/images/icons/community.svg"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-[77.5rem] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-10 rounded-[2rem] border border-[#0000000D] bg-white hover:shadow-lg transition-all"
            >
              <img src={f.icon} alt="" className="mb-6 w-12 h-12" />
              <h3 className="text-[1.25rem] font-medium text-[#0A2623] mb-3">{f.title}</h3>
              <p className="text-[#0A2623B2] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;