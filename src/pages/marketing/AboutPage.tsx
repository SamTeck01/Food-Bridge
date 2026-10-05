import React from 'react';

import AboutImpactGoals from '../../components/aboutus/AboutImpactGoals';
import AboutProblemSolution from '../../components/aboutus/AboutProblemSolution';
import AboutTeam from '../../components/aboutus/AboutTeam';
import AboutHero from '../../components/aboutus/hero';
import CTASection from '../../components/homepage/CTASection';
import FAQSection from '../../components/homepage/FAQSection';
import Mission from '../../components/homepage/Mission';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
      <div className="relative z-10 flex flex-col bg-transparent -mb-8">
        <AboutHero />
      </div>
      <AboutProblemSolution />   
      <AboutImpactGoals />
      <AboutTeam />
      <Mission lines={['This is just the beginning.', "Every listing posted is a meal saved, while every claim is food that didn't go to waste."]} />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default AboutPage;