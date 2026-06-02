import React from 'react';

import AboutImpactGoals from '../../components/aboutus/AboutImpactGoals';
import AboutProblemSolution from '../../components/aboutus/AboutProblemSolution';
import AboutTeam from '../../components/aboutus/AboutTeam';
import AboutHero from '../../components/aboutus/hero';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
      <div 
        className="relative flex flex-col bg-[#FFFDF2]"
        style={{ 
          minHeight: '80vh'
        }}
      >
        <AboutHero />                 
      </div>
      <AboutProblemSolution />   
      <AboutImpactGoals />
      <AboutTeam />
    </div>
  );
};

export default AboutPage;