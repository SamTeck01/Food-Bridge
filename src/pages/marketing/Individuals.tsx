import React from 'react';

import CTASection from '../../components/homepage/CTASection';
import FAQSection from '../../components/homepage/FAQSection';
import IndividualHero from '../../components/individuals/IndividualHero';
import IndividualsChatSection from '../../components/individuals/IndividualsChatSection';
import IndividualsMission from '../../components/individuals/IndividualsMission';
import IndividualWorks from '../../components/individuals/individualworks';
import ReasonsSection from '../../components/Vendor/VendorReason';
import type { Benefit } from '../../components/Vendor/VendorReason';
import { StarIcon, Location01Icon, ZapIcon, FavouriteIcon } from 'hugeicons-react';

const INDIVIDUAL_BENEFITS: Benefit[] = [
  { id: 1, title: 'Save Money', description: 'Get meals at discounted prices', icon: <StarIcon size={24} className="text-[#3CB371]" />, bgShape: '/images/Vendor/reason-1.svg' },
  { id: 2, title: 'Find Nearby Food', description: "Only see what's close to you", icon: <Location01Icon size={24} className="text-[#3CB371]" />, bgShape: '/images/Vendor/reason-2.svg' },
  { id: 3, title: 'Fast & Easy', description: 'Claim in seconds, pick up anytime', icon: <ZapIcon size={24} className="text-[#3CB371]" />, bgShape: '/images/Vendor/reason-3.svg' },
  { id: 4, title: 'Real Food', description: 'From real restaurants you trust', icon: <FavouriteIcon size={24} className="text-[#3CB371]" />, bgShape: '/images/Vendor/reason-4.svg' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
        <div 
            className="relative flex flex-col bg-[#FFFDF2]"
        >
            <IndividualHero />             
        </div>
        <IndividualsChatSection />
        <ReasonsSection audience="people" benefits={INDIVIDUAL_BENEFITS} />
        <IndividualWorks />
        <IndividualsMission />
        <div className="px-4 md:px-[3rem]">
            <FAQSection />
        </div>
        <CTASection />
    </div>
  );
};

export default AboutPage;