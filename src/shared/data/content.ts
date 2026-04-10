import cardImage1 from '@/shared/assets/images/card-1.png';
import cardImage2 from '@/shared/assets/images/card-2.png';
import cardImage3 from '@/shared/assets/images/card-3.png';
import cardImage4 from '@/shared/assets/images/card-4.png';
import checkIcon from '@/shared/assets/images/check.svg';

export const navigationItems = [
  { label: 'Credit card', href: '#hero' },
  { label: 'Product', href: '#features' },
  { label: 'Account', href: '#exchange' },
  { label: 'Resources', href: '#news' },
];

export const heroCards = [
  { image: cardImage1, alt: 'Credit card design in neon waves' },
  { image: cardImage2, alt: 'Credit card design with blue network lines' },
  { image: cardImage3, alt: 'Credit card design with colorful diagonal streaks' },
  { image: cardImage4, alt: 'Credit card design with cosmic texture' },
];

export const featureItems = [
  { icon: checkIcon, label: 'Powerful online protection.' },
  { icon: checkIcon, label: 'Cashback without borders.' },
  { icon: checkIcon, label: 'Personal design' },
  { icon: checkIcon, label: 'Work anywhere in the world' },
];

export const exchangeRates = [
  [
    { code: 'USD', value: '60.78' },
    { code: 'CNY', value: '9.08' },
    { code: 'CHF', value: '64.78' },
  ],
  [
    { code: 'USD', value: '60.78' },
    { code: 'JPY', value: '0.46' },
    { code: 'TRY', value: '3.39' },
  ],
];


export const footerLinks = [
  'About bank',
  'Ask a Question',
  'Quality of service',
  'Requisites',
  'Press center',
  'Bank career',
  'Investors',
  'Analytics',
  'Business and processes',
];
