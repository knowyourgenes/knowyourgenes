import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { auth } from '@/features/auth';
import { prisma } from '@/server/prisma';
import { RECENT_ORDER_COOKIE } from '@/features/orders/recent-order';
import { GuestAccountPrompt } from '@/features/checkout/components/GuestAccountPrompt';
import { formatPaise } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order confirmed · KYG · Know Your Genes',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ order?: string }>;

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { order: orderNumber } = await searchParams;
  const session = await auth();
  if (!orderNumber) notFound();

  // A GUEST HAS NO SESSION TO CHECK, so the receipt cookie set by
  // /api/checkout/verify stands in: it names the one order this browser just
  // paid for. Without it, `?order=` would be an enumeration hole - order
  // numbers are sequential, and the page prints a name, a full postal address
  // and the exact genetic tests bought.
  const jar = await cookies();
  const receipt = jar.get(RECENT_ORDER_COOKIE)?.value;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, address: true, user: { select: { email: true } } },
  });
  if (!order) notFound();

  const owns = session?.user?.id === order.userId;
  const justPaid = receipt === order.orderNumber;
  if (!owns && !justPaid) notFound();

  // Only for someone with no session: a signed-in buyer is already where the
  // prompt would send them, so showing it to them is pure noise.
  const showGuestPrompt = !session?.user?.id && justPaid;

  const steps = order.slotDate
    ? [
        'Our team confirms your slot on WhatsApp.',
        'A trained phlebotomist collects your sample at home.',
        'The lab processes it and your report lands in your dashboard.',
      ]
    : [
        'Our delivery partner brings one saliva kit to the address below - you will get a tracking link.',
        'Spit in the tube, seal it, and hand it straight back to the courier with the prepaid label.',
        'It travels to the lab, and every report you ordered is read from that one sample.',
        'Your results arrive online in your dashboard - nothing to collect, nothing posted back to you.',
      ];

  // Site header/footer come from app/(site)/layout.tsx.
  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[760px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-eden text-spring">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>

        <h1 className="mt-5 text-[clamp(28px,4vw,42px)] font-semibold leading-[1.08] tracking-[-0.025em]">
          {order.paidAt ? "You're all set." : 'Order received.'}
        </h1>
        <p className="mt-3 text-[16.5px] leading-[1.6] text-cape">
          Order <span className="font-mono font-semibold text-mine">{order.orderNumber}</span> ·{' '}
          {formatPaise(order.total)} {order.paidAt ? 'paid' : 'pending payment'}. A confirmation is on its way to your
          email.
        </p>

        <div className="mt-8 rounded-sm border border-zeus/[0.09] bg-white p-6 shadow-kyg-card">
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">What you ordered</h2>
          <p className="mt-1 text-[13.5px] text-cord">
            One saliva kit · {order.items.length} report{order.items.length === 1 ? '' : 's'} read from the same sample
          </p>
          <ul className="mt-3 divide-y divide-zeus/[0.07]">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 py-2.5 text-[14.5px]">
                <span className="text-cape">
                  {i.nameSnapshot}
                  {i.quantity > 1 && <span className="text-cord"> × {i.quantity}</span>}
                </span>
                <span className="tabular-nums">{formatPaise(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-zeus/[0.09] pt-3 text-[13.5px] leading-[1.6] text-cord">
            Shipping to <b className="font-semibold text-cape">{order.address.fullName}</b>, {order.address.line1},{' '}
            {order.address.area}, {order.address.city} {order.address.pincode}
          </p>
        </div>

        <div className="mt-6 rounded-sm border border-zeus/[0.09] bg-white p-6 shadow-kyg-card">
          <h2 className="text-[16px] font-semibold tracking-[-0.015em]">What happens next</h2>
          <ol className="mt-3 space-y-3">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-[14.5px] leading-[1.55] text-cape">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-eden/[0.09] text-[12px] font-bold text-eden">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/orders/${order.orderNumber}`}
            className="rounded-sm bg-eden px-5 py-3 text-[14px] font-bold text-spring transition hover:bg-eden2"
          >
            Track this order
          </Link>
          <Link
            href="/categories/wellness"
            className="rounded-sm border border-eden/30 px-5 py-3 text-[14px] font-bold text-eden transition hover:bg-eden/[0.06]"
          >
            Browse more tests
          </Link>
        </div>
      </div>
      {showGuestPrompt && <GuestAccountPrompt email={order.user?.email ?? ''} orderNumber={order.orderNumber} />}
    </div>
  );
}
