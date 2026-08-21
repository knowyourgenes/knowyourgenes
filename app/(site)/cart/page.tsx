import type { Metadata } from 'next';
import { CartView } from '@/features/cart/components/CartView';

// Site header/footer come from app/(site)/layout.tsx - do not render them here.
export const metadata: Metadata = {
  title: 'Your cart · KYG · Know Your Genes',
  description: 'Review the tests in your cart before checkout.',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">Your order</span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          Your cart
        </h1>
        <CartView />
      </div>
    </div>
  );
}
