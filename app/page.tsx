import HomePage from '@/components/home/Homepage';
import { Figtree, Hind } from 'next/font/google';

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-figtree',
  display: 'swap',
});

const hind = Hind({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

const page = () => {
  return (
    <div className={`${figtree.variable} ${hind.variable}`}>
      <HomePage />
    </div>
  );
};

export default page;
