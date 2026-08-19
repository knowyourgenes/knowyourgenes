import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/features/auth';
import { prisma } from '@/server/prisma';
import { CheckoutView } from '@/features/checkout/components/CheckoutView';

// Site header/footer come from app/(site)/layout.tsx - do not render them here.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout · KYG · Know Your Genes',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await auth();
  // Payment needs an account: the order has to belong to someone who can be
  // shipped to, contacted about a report, and refunded.
  if (!session?.user) redirect('/login?from=/checkout');

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1120px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">Almost there</span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          Checkout
        </h1>
        <CheckoutView addresses={addresses} customerName={session.user.name ?? ''} />
      </div>
    </div>
  );
}
