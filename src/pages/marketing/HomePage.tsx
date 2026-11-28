import AudienceSection from '../../components/homepage/AudienceSection';
import CTASection from '../../components/homepage/CTASection';
import FAQSection from '../../components/homepage/FAQSection';
import Hero from '../../components/homepage/Hero';
import HowItWorks from '../../components/homepage/HowItWorks';
import ImpactSection from '../../components/homepage/ImpactSection';
import Mission from '../../components/homepage/Mission';

const HomePage = () => {

  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
      <div 
        className="relative flex flex-col bg-bottom bg-no-repeat bg-contain lg:bg-cover sm:min-h-[80vh]"
        style={{ 
          backgroundImage: 'url("/images/homepage/hero-main.svg")',
        }}
      >
        <div className="h-12 lg:h-[4.9rem]" /> 
        <Hero />
      </div>
      
      <main>
        <Mission />
        <AudienceSection />
        <HowItWorks />
        <ImpactSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
};

export default HomePage;