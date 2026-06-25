// Mega-menu content for the shared KYG header. Site-wide chrome data - lives
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
      {
        kicker: 'Report 01',
        title: 'My Diet',
        desc: "Nutrition insights personalized for your body. What works, what doesn't.",
        href: '/wellness/my-diet',
        image: `${U}/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80`,
        imageAlt: 'My Diet',
      },
      {
        kicker: 'Report 02',
        title: 'My Weight',
        desc: 'Understand your metabolism and weight tendencies.',
        href: '/wellness/my-weight',
        image: `${U}/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=900&q=80`,
        imageAlt: 'My Weight',
      },
      {
        kicker: 'Report 03',
        title: 'My Fitness',
        desc: 'Train smarter. Strength, endurance and recovery insights.',
        href: '/wellness/my-fitness',
        image: `${U}/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80`,
        imageAlt: 'My Fitness',
      },
      {
        kicker: 'Report 04',
        title: 'My Detox',
        desc: 'Stress response and detoxification pathways.',
        href: '/wellness/my-detox',
        image: `${U}/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80`,
        imageAlt: 'My Detox',
      },
    ],
  },
];

export const NAV_LINKS = [
  { label: "Men's Health", href: '/mens-health/mens-health-dna' },
  { label: 'Blog', href: '/blog' },
];
