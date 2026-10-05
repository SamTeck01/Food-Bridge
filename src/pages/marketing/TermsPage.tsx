import LegalPage from '../../components/legal/LegalPage';
import type { LegalSection } from '../../components/legal/LegalPage';

const sections: LegalSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    intro: [
      'Welcome to FoodBridge, a digital platform that connects food vendors with individuals seeking affordable meals by enabling the listing and claiming of surplus food.',
      'FoodBridge acts solely as an intermediary and does not prepare, handle, or deliver food. By using our platform, you agree to the terms and conditions described below.',
    ],
  },
  {
    id: 'eligibility',
    title: 'User Eligibility',
    intro: ['By using FoodBridge, you confirm that:'],
    items: [
      'You are at least 18 years old (or have guardian consent)',
      'You provide accurate account information',
      'You agree to comply with all applicable laws',
    ],
  },
  {
    id: 'vendors',
    title: 'Vendors Responsibilities',
    intro: ['Vendors agree to:'],
    items: [
      'Provide accurate food descriptions',
      'Ensure food is safe, properly handled, and suitable for consumption',
      'Comply with local food safety regulations',
      'Honor confirmed listings and pickup times',
    ],
    note: 'Vendors are solely responsible for the quality, safety, and condition of the food they provide.',
  },
  {
    id: 'claimers',
    title: 'User (Claimer) Responsibilities',
    intro: ['Users agree to:'],
    items: [
      'Review food details before claiming',
      'Pick up food within the stated time',
      'Handle food responsibly after pickup',
    ],
  },
  {
    id: 'food-safety',
    title: 'Food Safety Disclaimer',
    intro: ['FoodBridge does not prepare, inspect, or guarantee the safety or quality of food listed on the platform.'],
    note: 'By using the platform, users acknowledge that food consumption is at their own discretion and risk.',
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    intro: ['To the fullest extent permitted by law:'],
    items: [
      'FoodBridge is not liable for any illness, injury, or damages resulting from food obtained through the platform',
      'Responsibility for food safety lies with the vendor',
    ],
  },
  {
    id: 'conduct',
    title: 'Platform Use & Conduct',
    intro: ['Users must not:'],
    items: [
      'Post false or misleading information',
      'Engage in fraudulent activities',
      'Abuse or misuse the platform',
    ],
    note: 'FoodBridge reserves the right to suspend or terminate accounts that violate these terms.',
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
    id: 'modifications',
    title: 'Modifications to Service',
    intro: ['FoodBridge may update or modify the platform and these terms at any time. Users will be notified of significant changes.'],
  },
  {
    id: 'contact',
    title: 'Contact',
    intro: ['For questions or concerns:'],
    email: 'support@foodbridge.com',
  },
];

const TermsPage = () => <LegalPage title="Terms of Service" lastUpdated="May 2026" sections={sections} />;

export default TermsPage;
