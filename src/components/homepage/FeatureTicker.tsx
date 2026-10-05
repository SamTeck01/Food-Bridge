const features = [
  { label: 'Freshly Prepared Meals', icon: 'star.svg' },
  { label: 'Surplus Food Available Daily', icon: 'sparkle.svg' },
  { label: 'Easy Online Claim Process', icon: 'plus.svg' },
  { label: 'Eco-Friendly Packaging', icon: 'leaf.svg' },
  { label: 'Trusted by Local Communities', icon: 'heart.svg' },
  { label: 'Real-Time Availability Updates', icon: 'bolt.svg' },
];

/** Horizontally auto-scrolling strip of FoodBridge selling points */
const FeatureTicker = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="flex space-x-[0.75rem] animate-scroll whitespace-nowrap">
      {[...features, ...features].map((feature, i) => (
        <div
          key={i}
          className="px-8 py-[0.59rem] rounded-[5px] border border-[#FFFFFF1A] bg-[#FFFFFF1A] text-[#FFFFFF] text-sm md:text-base flex items-center gap-[0.625rem]"
        >
          <img src={`/images/homepage/${feature.icon}`} alt="" className="w-5 h-5 object-contain" />
          <span className="font-light">{feature.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FeatureTicker;
