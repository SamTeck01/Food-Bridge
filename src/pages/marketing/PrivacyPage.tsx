import LegalPage from '../../components/legal/LegalPage';
import type { LegalSection } from '../../components/legal/LegalPage';

const sections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    intro: [
      'Welcome to FoodBridge, a digital platform that connects food vendors with individuals seeking affordable meals by enabling the listing and claiming of surplus food.',
      'FoodBridge respects your privacy and is committed to protecting your personal information. Our commitment to safeguarding your data is rooted in our respect for your trust. We want you to feel confident that your information is handled responsibly and ethically. Please read this policy carefully to understand how we manage your data.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    intro: ['We may collect the following types of information:'],
    items: [
      '👤 Personal Information: name, email address, phone number',
      '📍 Location Data: to show nearby food listings and improve user experience',
      '📱 Usage Data: app interactions, pages visited, listings viewed or claimed',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How we use your information',
    intro: ['We use your information to:'],
    items: [
      'Provide and improve our services',
      'Connect users with nearby vendors',
      'Process transactions',
      'Communicate updates and support',
      'Ensure platform safety and security',
    ],
  },
  {
    id: 'sharing',
    title: 'Information sharing',
    intro: ['We do not sell your personal data. We may share information:'],
    items: [
      'With vendors (only necessary details for pickup)',
      'With service providers (e.g., payment processing)',
      'When required by law',
    ],
  },
  {
    id: 'protection',
    title: 'Data protection',
    intro: ['We take reasonable steps to protect your data, including:'],
    items: ['Secure servers', 'Encrypted connections', 'Access control'],
  },
  {
    id: 'retention',
    title: 'Data Retention',
    intro: ['We retain your data only as long as necessary to:'],
    items: ['Provide our services', 'Comply with legal obligations'],
  },
  {
    id: 'rights',
    title: 'Your Rights',
    intro: ['You have the right to:'],
    items: ['Access your data', 'Request correction', 'Request deletion', 'Opt out of communications'],
  },
  {
    id: 'payments',
    title: 'Payments',
    items: [
      'Payments are processed through the platform',
      'Vendors receive payment based on completed transactions',
      'Refund policies may apply based on specific cases',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    intro: ['FoodBridge may use cookies or similar technologies to:'],
    items: ['Improve user experience', 'Analyze platform usage'],
  },
  {
    id: 'updates',
    title: 'Policy Updates',
    intro: ['We may update this Privacy Policy from time to time. Users will be notified of significant changes.'],
  },
  {
    id: 'contact',
    title: 'Contact',
    intro: ['For questions or concerns:'],
    email: 'support@foodbridge.com',
  },
];

const PrivacyPage = () => <LegalPage title="Privacy Policy" lastUpdated="May 2026" sections={sections} />;

export default PrivacyPage;
