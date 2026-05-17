import React from 'react';
import { motion } from 'framer-motion';

// Replace these with actual lucide-react icons if you prefer, or use your custom SVGs
const XIcon = () => <span className="font-bold text-lg">𝕏</span>;
const LinkedInIcon = () => <span className="font-bold text-lg">in</span>;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageSrc?: string; // Optional because some might not have photos yet
  xLink: string;
  linkedInLink: string;
}

const team: TeamMember[] = [
  { id: 1, name: 'Abdulbassit Abdullahi Alagbe', role: 'Designer', imageSrc: '/assets/team-1.svg', xLink: '#', linkedInLink: '#' },
  { id: 2, name: 'Baskey Koer', role: 'Designer', xLink: '#', linkedInLink: '#' },
  { id: 3, name: 'Abdulbassit Abdullahi Alagbe', role: 'Designer', imageSrc: '/assets/team-1.svg', xLink: '#', linkedInLink: '#' },
  { id: 4, name: 'Abdulbassit Abdullahi Alagbe', role: 'Designer', xLink: '#', linkedInLink: '#' },
  { id: 5, name: 'Abdulbassit Abdullahi Alagbe', role: 'Designer', imageSrc: '/assets/team-1.svg', xLink: '#', linkedInLink: '#' },
  { id: 6, name: 'Abdulbassit Abdullahi Alagbe', role: 'Designer', xLink: '#', linkedInLink: '#' },
];

const AboutTeam: React.FC = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-[#0A2521]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-[60px] font-normal mb-4">Meet the Builders</h2>
        <p className="text-[#0A2623] text-sm md:text-base w-[465px] mx-auto">
          We are designers, developers, and problem-solvers passionate about using technology for impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, index) => (
          <motion.div 
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white group hover:shadow-lg transition-all duration-300"
          >
            {/* Image/Avatar Container */}
            <div className="bg-[#EAF3EC] h-[300px] flex items-end justify-center overflow-hidden">
              {member.imageSrc ? (
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={member.imageSrc} 
                  alt={member.name} 
                  className="w-full h-full object-cover origin-bottom"
                />
              ) : (
                <div className="w-full h-full bg-[#EAF3EC]"></div> // Fallback background
              )}
            </div>

            {/* Content Container */}
            <div className="p-5 flex items-center justify-between h-[150px] ">
              <div>
                <h3 className="font-normal text-[24px] text-gray-900 w-[323.33px]">{member.name}</h3>
                <span className="text-[#3CB371] text-xs font-normal bg-green-50 px-2 py-[10px] rounded-md mt-1 inline-block">
                  {member.role}
                </span>
              </div>
              <div className="flex gap-3 text-gray-400 w-[20px]">
                <a href={member.xLink} className="hover:text-gray-900 transition-colors">
                  <XIcon />
                </a>
                <a href={member.linkedInLink} className="hover:text-blue-600 transition-colors">
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AboutTeam;