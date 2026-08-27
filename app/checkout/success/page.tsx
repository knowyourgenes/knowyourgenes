import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ArrowRight, Check, MapPin } from 'lucide-react';

import { auth } from '@/features/auth';
import { prisma } from '@/server/prisma';
import { RECENT_ORDER_COOKIE } from '@/features/orders/recent-order';
import { GuestAccountPrompt } from '@/features/checkout/components/GuestAccountPrompt';
import { formatPaise } from '@/lib/catalog';
import SiteHeader from '@/components/shared/SiteHeader';
import { Container } from '@/components/shared/Container';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Order confirmed · KYG · Know Your Genes',
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ order?: string }>;

/**
 * /checkout/success - the receipt.
 *
 * OUT OF THE (site) GROUP ON PURPOSE, which is why this file renders its own
 * SiteHeader. That group appends a full site footer to everything inside it, and
 * a footer is a guaranteed scrollbar - so a receipt could never be "one screen"
 * while it lived there. /login, /register and /set-password sit directly under
 * app/ for the same reason; this joins them.
 *
 * NOTHING ON THIS PAGE SCROLLS. The shell is exactly the viewport minus the
 * header and clips its overflow; the two panels inside it scroll independently
 * if their own content is long. That matters because the content is variable -
 * an order can carry one test or six - and a layout that fits the common case
 * and breaks on the sixth is not a fixed layout, it is a lucky one.
 *
 * Below `lg` it stacks and the page is allowed to scroll normally. A phone is
 * around 660px tall and this content does not fit in it; pretending otherwise
 * would mean hiding something the customer just paid for.
 */
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
        'Our team confirms your slot with you.',
        'A trained phlebotomist collects your sample at home.',
        'The lab reads it and your report arrives in your dashboard.',
      ]
    : [
        'A saliva kit is couriered to the address below.',
        'Spit in the tube, seal it, hand it back with the prepaid label.',
        'Every report you ordered is read from that one sample.',
        'Your results arrive in your dashboard - nothing to collect.',
      ];

  return (
    <div className="flex min-h-svh flex-col bg-spring font-kyg text-mine antialiased">
      <SiteHeader />

      {/*
        `min-h-0` is what makes the clip work: without it a flex child refuses to
        shrink below its content, and the panels inside would push the shell
        taller than the viewport instead of scrolling within it.
      */}
      <main className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
        {/* Container is the ONE page-shell width (DESIGN.md 1). An earlier draft
            capped the receipt narrower inside it, which is exactly the habit the
            rule exists to stop - every page believes it is the exception, and
            that is how the codebase ended up with twelve shell widths. Two
            panels across 1600px read fine; the rule wins. */}
        <Container className="flex min-h-0 flex-1 flex-col justify-center gap-[clamp(16px,2.6vh,28px)] py-[clamp(20px,3.4vh,40px)]">
          {/* ---- confirmation ---- */}
          <div className="flex shrink-0 items-start gap-4">
            <span className="grid h-[clamp(38px,5vh,48px)] w-[clamp(38px,5vh,48px)] shrink-0 place-items-center rounded-sm bg-eden text-spring">
              <Check className="h-[55%] w-[55%]" strokeWidth={2.6} aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="text-[clamp(24px,3.6vh,38px)] font-semibold leading-[1.06] tracking-[-0.025em]">
                {order.paidAt ? "You're all set." : 'Order received.'}
              </h1>
              <p className="mt-1.5 text-[clamp(13.5px,1.7vh,15.5px)] leading-[1.5] text-cape">
                Order <span className="font-mono font-semibold text-mine">{order.orderNumber}</span> ·{' '}
                <span className="font-semibold text-mine">{formatPaise(order.total)}</span>{' '}
                {order.paidAt ? 'paid' : 'pending payment'}. A confirmation is on its way to your email.
              </p>
            </div>
          </div>

          {/* ---- the two panels ---- */}
          <div className="grid min-h-0 items-start gap-[clamp(12px,1.8vh,20px)] lg:grid-cols-2">
            {/* what you ordered */}
            <section className="flex max-h-full min-h-0 flex-col self-start rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card">
              <div className="shrink-0 border-b border-zeus/[0.07] px-[clamp(16px,2vw,24px)] py-[clamp(12px,1.8vh,18px)]">
                <h2 className="text-[15px] font-semibold tracking-[-0.015em]">What you ordered</h2>
                <p className="mt-0.5 text-[12.5px] text-cord">
                  One saliva kit · {order.items.length} report{order.items.length === 1 ? '' : 's'} from the same sample
                </p>
              </div>

              {/* The one list that can genuinely run long. It scrolls, the page does not. */}
              <ul className="min-h-0 flex-1 divide-y divide-zeus/[0.07] overflow-y-auto px-[clamp(16px,2vw,24px)]">
                {order.items.map((i) => (
                  <li key={i.id} className="flex items-baseline justify-between gap-3 py-[clamp(9px,1.4vh,13px)]">
                    <span className="text-[14px] leading-snug text-cape">{i.nameSnapshot}</span>
                    <span className="shrink-0 text-[14px] tabular-nums">{formatPaise(i.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="shrink-0 border-t border-zeus/[0.09] px-[clamp(16px,2vw,24px)] py-[clamp(11px,1.6vh,16px)]">
                <p className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-cord">
                  <MapPin className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>
                    <b className="font-semibold text-cape">{order.address.fullName}</b> · {order.address.line1},{' '}
                    {order.address.area}, {order.address.city} {order.address.pincode}
                  </span>
                </p>
              </div>
            </section>

            {/* what happens next */}
            <section className="flex max-h-full min-h-0 flex-col self-start rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card">
              <div className="shrink-0 border-b border-zeus/[0.07] px-[clamp(16px,2vw,24px)] py-[clamp(12px,1.8vh,18px)]">
                <h2 className="text-[15px] font-semibold tracking-[-0.015em]">What happens next</h2>
                <p className="mt-0.5 text-[12.5px] text-cord">Nothing needed from you until the kit arrives.</p>
              </div>

              <ol className="min-h-0 flex-1 space-y-[clamp(10px,1.5vh,16px)] overflow-y-auto px-[clamp(16px,2vw,24px)] py-[clamp(12px,1.8vh,18px)]">
                {steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-[13.5px] leading-[1.5] text-cape">
                    <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-eden/[0.09] text-[11.5px] font-bold text-eden">
                      {i + 1}
                    </span>
                    <span className="pt-[1px]">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* ---- actions ---- */}
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href={`/dashboard/orders/${order.orderNumber}`}
              className="inline-flex h-[44px] items-center gap-2 rounded-sm bg-eden px-5 text-[14px] font-bold text-spring transition hover:bg-eden2"
            >
              Track this order
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-[44px] items-center rounded-sm border border-eden/30 px-5 text-[14px] font-bold text-eden transition hover:bg-eden/[0.06]"
            >
              Browse more tests
            </Link>
          </div>
        </Container>
      </main>

      {showGuestPrompt && <GuestAccountPrompt email={order.user?.email ?? ''} orderNumber={order.orderNumber} />}
    </div>
  );
}
