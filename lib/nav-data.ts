// Mega-menu content for the shared KYG header. Site-wide chrome data - lives
// with the component, not with any one route's data.

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
    label: 'Wellness',
    title: 'Explore our DNA tests',
    subtitle: 'One at-home saliva kit. Choose the report that matters most to you.',
    cards: [
      {
        kicker: "Men's Health",
        title: "Men's Health DNA",
        desc: 'Fertility, hormones and hair-loss risk in one saliva test.',
        href: '/categories/wellness/mens-health',
        image: '/tests/mens-health/hero-man.png',
        imageAlt: "Men's Health DNA",
      },
      {
        kicker: "Women's Health",
        title: "Women's Health DNA",
        desc: "Clinical panels focused on women's genetic health.",
        href: '/categories/wellness/womens-health',
        image: '/tests/womens-health/hero-woman.png',
        imageAlt: "Women's Health DNA",
      },
      {
        kicker: 'Ancestry',
        title: 'Ancestry DNA',
        desc: 'Trace your heritage and genetic origins.',
        href: '/categories/wellness/ancestry',
        image: '/tests/ancestry/hero-map.png',
        imageAlt: 'Ancestry DNA',
      },
      {
        kicker: 'Wellness',
        title: 'My Wellness',
        desc: 'Diet, weight, fitness and detox insights in one report.',
        href: '/categories/wellness/my-wellness',
        image: '/tests/my-wellness/hero-wellness.png',
        imageAlt: 'My Wellness',
      },
    ],
  },
  {
    key: 'womens-health',
    label: "Women's Health",
    title: "Women's health",
    subtitle: 'Genetic insight for the questions that matter most, before they become a crisis.',
    cards: [
      {
        kicker: "Women's Health",
        title: "Women's Health DNA",
        desc: 'Is your PCOS genetic? Read your THADA variant and manage it early.',
        href: '/womens-health',
        image: '/landing/womens-health/hero.png',
        imageAlt: "Women's Health DNA",
      },
      {
        kicker: 'Fertility',
        title: 'Recurrent Pregnancy Loss',
        desc: 'MTHFR and FOXP3 risk, so you and your doctor can act before you begin trying.',
        href: '/pregnancy-loss',
        image: '/landing/pregnancy-loss/hero.png',
        imageAlt: 'Recurrent Pregnancy Loss',
      },
      {
        kicker: 'Maternal',
        title: 'Peripartum Depression',
        desc: 'Read your COMT variant and prepare before birth, not react after.',
        href: '/peripartum-depression',
        image: '/landing/peripartum-depression/hero.png',
        imageAlt: 'Peripartum Depression',
      },
    ],
  },
];

/**
 * Flat links rendered AFTER the mega menus - i.e. the right-hand end of the
 * desktop nav, which is right-aligned (`ml-auto`). Contact sits last so it
 * reads as the terminal action.
 */
export const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
