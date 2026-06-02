// Mega-menu content for the shared KYG header. Site-wide chrome data — lives
// with the component, not with any one route's data.
const U = 'https://images.unsplash.com';

export interface MegaCard {
  kicker: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  imageAlt: string;
}

export interface MegaMenu {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  cards: MegaCard[];
}

export const NAV_MENUS: MegaMenu[] = [
  {
    key: 'wellness',
    label: 'Wellness Package',
    title: 'The Wellness Package',
    subtitle: '4 personalized wellness reports from a single saliva sample, built for Indian biology.',
    cards: [
      { kicker: 'Report 01', title: 'My Diet', desc: "Nutrition insights personalized for your body. What works, what doesn't.", href: '#wellness', image: `${U}/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80`, imageAlt: 'My Diet' },
      { kicker: 'Report 02', title: 'My Weight', desc: 'Understand your metabolism and weight tendencies.', href: '#wellness', image: `${U}/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=900&q=80`, imageAlt: 'My Weight' },
      { kicker: 'Report 03', title: 'My Fitness', desc: 'Train smarter. Strength, endurance and recovery insights.', href: '#wellness', image: `${U}/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80`, imageAlt: 'My Fitness' },
      { kicker: 'Report 04', title: 'My Detox', desc: 'Stress response and detoxification pathways.', href: '#wellness', image: `${U}/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80`, imageAlt: 'My Detox' },
    ],
  },
  {
    key: 'howitworks',
    label: 'How It Works',
    title: 'From Order to Insight',
    subtitle: 'Five gentle steps. Simple, private, personalized, and supported by humans, not just algorithms.',
    cards: [
      { kicker: 'Step 01', title: 'Order Your Kit', desc: 'Choose your personalized wellness journey.', href: '#how', image: `${U}/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Order kit' },
      { kicker: 'Step 02 & 03', title: 'Collect & Send', desc: 'Simple, non-invasive saliva collection.', href: '#how', image: `${U}/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Saliva collection' },
      { kicker: 'Step 04', title: 'Receive Reports', desc: 'Plain-English wellness insights.', href: '#report', image: `${U}/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Reports' },
      { kicker: 'Step 05', title: 'Talk to an Expert', desc: 'GENEous Care helps you make sense of it.', href: '#care', image: `${U}/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Care expert' },
    ],
  },
  {
    key: 'learn',
    label: 'Learn',
    title: 'Health, Decoded',
    subtitle: 'Short, science-grounded reads. Plus the why behind KYG, our trust principles and family-focused care.',
    cards: [
      { kicker: 'Articles', title: 'Health Decoded', desc: 'Breaking everyday wellness myths.', href: '#decoded', image: `${U}/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Health Decoded' },
      { kicker: 'Science', title: 'The Science of KYG', desc: 'Genetics, simplified for real life.', href: '#what', image: `${U}/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Science' },
      { kicker: 'Family', title: 'Senior Care', desc: 'Preventive wellness for parents.', href: '#senior', image: `${U}/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Senior Care' },
      { kicker: 'Trust', title: 'Privacy & Data', desc: 'How we keep your data yours.', href: '#privacy', image: `${U}/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80`, imageAlt: 'Trust & Privacy' },
    ],
  },
];

export const NAV_LINKS = [{ label: 'GENEous Care', href: '#care' }];
