import React from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from '../components/aboutus/hero';
import AboutProblemSolution from '../components/aboutus/AboutProblemSolution';
import AboutImpactGoals from '../components/aboutus/AboutImpactGoals';
import AboutTeam from '../components/aboutus/AboutTeam';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
      <div 
        className="relative flex flex-col bg-[#FFFDF2]"
        style={{ 
          minHeight: '80vh'
        }}
      >
        <Navbar />
        <AboutHero />                 
      </div>
      <AboutProblemSolution />   
      <AboutImpactGoals />
      <AboutTeam />
      <Footer />
    </div>
  );
};

export default AboutPage;