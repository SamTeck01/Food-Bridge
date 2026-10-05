const Logo = ({ className = '' }: { className?: string }) => (
  <img src="/images/homepage/logo.svg" alt="FoodBridge" className={`h-10 w-auto ${className}`} />
);

export default Logo;
