import cardImage1 from '@/shared/assets/images/card-1.png';
import cardImage2 from '@/shared/assets/images/card-2.png';
import cardImage3 from '@/shared/assets/images/card-3.png';
import cardImage4 from '@/shared/assets/images/card-4.png';
import checkIcon from '@/shared/assets/images/check.svg';

export const navigationItems = [
  { label: 'Credit card', href: '/loan' },
  { label: 'Product', href: '/#features' },
  { label: 'Account', href: '/#exchange' },
  { label: 'Resources', href: '/#news' },
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
  { icon: checkIcon, label: 'Personal design.' },
  { icon: checkIcon, label: 'Work anywhere in the world.' },
];

export const courseCards = [
  {
    id: 'cashback',
    icon: checkIcon,
    title: 'Cashback card',
    heading: 'Up to 50% cashback',
    subtitle: 'For purchases from partners',
    description:
      'Get increased cashback from selected categories and partner offers every month.',
    text: 'Get increased cashback from selected categories and partner offers every month.',
    badge: 'Online',
    lessons: '4 benefits',
    action: 'Apply now',
    buttonText: 'Apply now',
    buttonLabel: 'Apply now',
    linkText: 'Apply now',
    href: '#application',
  },
  {
    id: 'withdrawal',
    icon: checkIcon,
    title: 'Travel card',
    heading: 'Free cash withdrawals',
    subtitle: 'At ATMs around the world',
    description:
      'Withdraw money without extra fees at partner ATMs and manage limits in the app.',
    text: 'Withdraw money without extra fees at partner ATMs and manage limits in the app.',
    badge: 'Popular',
    lessons: '24/7 access',
    action: 'Learn more',
    buttonText: 'Learn more',
    buttonLabel: 'Learn more',
    linkText: 'Learn more',
    href: '#exchange',
  },
  {
    id: 'delivery',
    icon: checkIcon,
    title: 'Delivery card',
    heading: 'Fast card delivery',
    subtitle: 'Simple online application',
    description:
      'Complete the application in a few minutes and receive the card at a convenient place.',
    text: 'Complete the application in a few minutes and receive the card at a convenient place.',
    badge: 'Fast',
    lessons: '3 steps',
    action: 'Order a card',
    buttonText: 'Order a card',
    buttonLabel: 'Order a card',
    linkText: 'Order a card',
    href: '#application',
  },
];

export const faqItems = [
  {
    id: 'faq-1',
    question: 'How do I apply for a card?',
    title: 'How do I apply for a card?',
    answer:
      'Fill out the online application, confirm your phone number, and wait for approval from the bank.',
    description:
      'Fill out the online application, confirm your phone number, and wait for approval from the bank.',
    text: 'Fill out the online application, confirm your phone number, and wait for approval from the bank.',
  },
  {
    id: 'faq-2',
    question: 'How long does approval take?',
    title: 'How long does approval take?',
    answer:
      'In most cases the application is reviewed within a few minutes, but sometimes it may take longer.',
    description:
      'In most cases the application is reviewed within a few minutes, but sometimes it may take longer.',
    text: 'In most cases the application is reviewed within a few minutes, but sometimes it may take longer.',
  },
  {
    id: 'faq-3',
    question: 'Can I use the card abroad?',
    title: 'Can I use the card abroad?',
    answer:
      'Yes, the card supports international payments and online purchases in foreign stores and services.',
    description:
      'Yes, the card supports international payments and online purchases in foreign stores and services.',
    text: 'Yes, the card supports international payments and online purchases in foreign stores and services.',
  },
  {
    id: 'faq-4',
    question: 'How often are exchange rates updated?',
    title: 'How often are exchange rates updated?',
    answer: 'Rates in the internet bank are updated automatically every 15 minutes.',
    description: 'Rates in the internet bank are updated automatically every 15 minutes.',
    text: 'Rates in the internet bank are updated automatically every 15 minutes.',
  },
];

export const metrics = [
  {
    id: 'metric-1',
    value: '50 days',
    amount: '50 days',
    title: 'Grace period',
    label: 'Grace period',
    description: 'Use credit funds for purchases without interest during the grace period.',
    text: 'Use credit funds for purchases without interest during the grace period.',
  },
  {
    id: 'metric-2',
    value: '24/7',
    amount: '24/7',
    title: 'Support',
    label: 'Support',
    description: 'Contact support at any time in chat, by phone, or in the mobile app.',
    text: 'Contact support at any time in chat, by phone, or in the mobile app.',
  },
  {
    id: 'metric-3',
    value: '6 currencies',
    amount: '6 currencies',
    title: 'Exchange rates online',
    label: 'Exchange rates online',
    description: 'Track current exchange rates for major currencies directly in the internet bank.',
    text: 'Track current exchange rates for major currencies directly in the internet bank.',
  },
  {
    id: 'metric-4',
    value: '0 ₽',
    amount: '0 ₽',
    title: 'Service fee',
    label: 'Service fee',
    description: 'No maintenance fee when the account conditions are met.',
    text: 'No maintenance fee when the account conditions are met.',
  },
];

export const processSteps = [
  'Fill out an application',
  'Get instant approval',
  'Receive the card',
  'Activate and use',
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
