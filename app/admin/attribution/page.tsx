import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ATTRIBUTION_COOKIE, verifyAttribution, payloadToAttribution } from '@/lib/attribution';
import PageHeader from '@/components/admin/PageHeader';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

function rupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default async function AttributionPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/');

  // -------------------------------------------------------------------------
  // 1. The admin's own current attribution cookie — proves capture is working.
  // -------------------------------------------------------------------------
  const cookieStore = await cookies();
  const raw = cookieStore.get(ATTRIBUTION_COOKIE)?.value;
  const payload = raw ? verifyAttribution(raw) : null;
  const decoded = payload ? payloadToAttribution(payload) : null;

  // -------------------------------------------------------------------------
  // 2. Order-attribution aggregate — the actual attribution report.
  //    Will be empty until checkout exists and Orders start landing.
  // -------------------------------------------------------------------------
  const grouped = await prisma.order.groupBy({
    by: ['attrSource', 'attrMedium'],
    where: {
      status: { notIn: ['CANCELLED', 'REFUNDED'] },
    },
    _count: { _all: true },
    _sum: { total: true },
    orderBy: { _sum: { total: 'desc' } },
  });

  const totalOrders = grouped.reduce((s, r) => s + r._count._all, 0);
  const totalRevenue = grouped.reduce((s, r) => s + (r._sum.total ?? 0), 0);

  // -------------------------------------------------------------------------
  // 3. Recent orders with attribution — useful for spot-checking.
  // -------------------------------------------------------------------------
  const recent = await prisma.order.findMany({
    where: { attrSource: { not: null } },
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      attrSource: true,
      attrMedium: true,
      attrCampaign: true,
      attrLandingPath: true,
      createdAt: true,
      campaign: { select: { name: true, slug: true } },
    },
  });

  // -------------------------------------------------------------------------
  // 4. Visit-level analytics — every UTM-bearing landing, regardless of
  //    whether it converted. Answers "how many people clicked my IG link?".
  // -------------------------------------------------------------------------
  const visitsGrouped = await prisma.attributionVisit.groupBy({
    by: ['source', 'medium'],
    _count: { _all: true },
    orderBy: { _count: { source: 'desc' } },
  });
  const visitsTotal = visitsGrouped.reduce((s, r) => s + r._count._all, 0);

  const recentVisits = await prisma.attributionVisit.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      source: true,
      medium: true,
      campaign: true,
      term: true,
      content: true,
      landingPath: true,
      referrer: true,
      sessionId: true,
      createdAt: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Attribution"
        subtitle="Where orders come from. UTM + referrer captured at first landing, attached to the Order when checkout completes."
      />

      {/* ----------------------------- COOKIE DEBUG PANEL ----------------------------- */}
      <section className="mb-10 rounded-lg border">
        <div className="border-b bg-muted/30 px-4 py-3">
          <h2 className="text-sm font-semibold">Your current attribution cookie</h2>
          <p className="text-xs text-muted-foreground">
            The signed <code className="rounded bg-muted px-1">kyg_attr</code> cookie your browser is sending right now.
            Useful for verifying capture before checkout exists.
          </p>
        </div>
        <div className="p-4">
          {!raw ? (
            <Empty
              title="No attribution cookie yet"
              body={
                <>
                  Open a private window and visit{' '}
                  <code className="rounded bg-muted px-1">
                    /?utm_source=test&amp;utm_medium=cpc&amp;utm_campaign=verify
                  </code>{' '}
                  to set one, or just visit <code className="rounded bg-muted px-1">/</code> to get a direct/none cookie.
                </>
              }
            />
          ) : !payload ? (
            <Empty
              title="Cookie present but signature invalid"
              body="The cookie failed HMAC verification. Either AUTH_SECRET changed since it was set, or the cookie was tampered with. It will be re-issued on the next page load."
            />
          ) : (
            <dl className="grid grid-cols-1 gap-y-3 gap-x-6 text-sm sm:grid-cols-2 md:grid-cols-3">
              <Field label="Source">
                <Badge variant="outline">{decoded!.source}</Badge>
              </Field>
              <Field label="Medium">
                <Badge variant="secondary">{decoded!.medium}</Badge>
              </Field>
              <Field label="Campaign">
                {decoded!.campaign ? <code>{decoded!.campaign}</code> : <Muted>—</Muted>}
              </Field>
              <Field label="Term">
                {decoded!.term ? <code>{decoded!.term}</code> : <Muted>—</Muted>}
              </Field>
              <Field label="Content">
                {decoded!.content ? <code>{decoded!.content}</code> : <Muted>—</Muted>}
              </Field>
              <Field label="Landing path">
                {decoded!.landingPath ? <code>{decoded!.landingPath}</code> : <Muted>—</Muted>}
              </Field>
              <Field label="Referrer">
                {decoded!.referrer ? (
                  <code className="break-all text-xs">{decoded!.referrer}</code>
                ) : (
                  <Muted>—</Muted>
                )}
              </Field>
              <Field label="First seen">
                {decoded!.firstSeenAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </Field>
              <Field label="Cookie">
                <code className="break-all text-[10px] text-muted-foreground">{raw.slice(0, 60)}…</code>
              </Field>
            </dl>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Tip — to test a fresh capture, open an <strong>incognito window</strong> (your existing cookie persists 30
            days) or append <code className="rounded bg-muted px-1">?attr_refresh=1</code> to force a rewrite.
          </p>
        </div>
      </section>

      {/* ----------------------------- VISIT-LEVEL ANALYTICS ----------------------------- */}
      <section className="mb-10">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Visits (clicks on UTM links)
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Every time someone lands on the site with UTM params, a row is written here. Independent of whether they
          bought — use this to answer &ldquo;how many clicks did my Instagram bio get this week?&rdquo;.
        </p>
        {visitsGrouped.length === 0 ? (
          <Empty
            title="No visits captured yet"
            body={
              <>
                Visit a UTM-bearing URL while logged out (or in incognito) to write a row. Try:{' '}
                <code className="rounded bg-muted px-1">
                  /?utm_source=instagram&amp;utm_medium=social&amp;utm_campaign=delhi-lab
                </code>
              </>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Source</th>
                  <th className="px-4 py-2 text-left font-medium">Medium</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">Visits</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">% of total</th>
                </tr>
              </thead>
              <tbody>
                {visitsGrouped.map((r) => {
                  const pct = visitsTotal > 0 ? (r._count._all / visitsTotal) * 100 : 0;
                  return (
                    <tr key={`v-${r.source}-${r.medium}`} className="border-t">
                      <td className="px-4 py-2">
                        <Badge variant="outline">{r.source ?? '—'}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary">{r.medium ?? '—'}</Badge>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{r._count._all}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{pct.toFixed(1)}%</td>
                    </tr>
                  );
                })}
                <tr className="border-t bg-muted/20 font-medium">
                  <td className="px-4 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{visitsTotal}</td>
                  <td className="px-4 py-2 text-right tabular-nums">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ----------------------------- RECENT VISITS ----------------------------- */}
      <section className="mb-10">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent visits
        </h2>
        {recentVisits.length === 0 ? (
          <Empty title="None yet" body="Visit a UTM URL to write a row." />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Source / medium</th>
                  <th className="px-4 py-2 text-left font-medium">Campaign</th>
                  <th className="px-4 py-2 text-left font-medium">Term / content</th>
                  <th className="px-4 py-2 text-left font-medium">Landed on</th>
                  <th className="px-4 py-2 text-left font-medium">Referrer</th>
                  <th className="px-4 py-2 text-left font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {recentVisits.map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">{v.source ?? '—'}</Badge>
                        <Badge variant="secondary">{v.medium ?? '—'}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {v.campaign ? <code>{v.campaign}</code> : <Muted>—</Muted>}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {v.term && <span>t: {v.term}</span>}
                      {v.term && v.content && <span> · </span>}
                      {v.content && <span>c: {v.content}</span>}
                      {!v.term && !v.content && <Muted>—</Muted>}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{v.landingPath ?? '—'}</td>
                    <td className="px-4 py-2 text-xs">
                      {v.referrer ? <code className="text-muted-foreground">{v.referrer}</code> : <Muted>—</Muted>}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {v.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ----------------------------- ATTRIBUTION SUMMARY ----------------------------- */}
      <section className="mb-10">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Orders by source × medium
        </h2>
        {grouped.length === 0 ? (
          <Empty
            title="No attributed orders yet"
            body={
              <>
                Order rows haven&rsquo;t been created yet (no checkout endpoint in place). Once orders start landing,
                this panel groups them by <code>attrSource</code> × <code>attrMedium</code> and shows revenue per
                bucket. See <a href="/admin/campaigns" className="underline">Campaigns</a> to generate trackable links.
              </>
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Source</th>
                  <th className="px-4 py-2 text-left font-medium">Medium</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">Orders</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">Revenue</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">AOV</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">% of revenue</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map((r) => {
                  const revenue = r._sum.total ?? 0;
                  const aov = r._count._all > 0 ? revenue / r._count._all : 0;
                  const pct = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                  return (
                    <tr key={`${r.attrSource}-${r.attrMedium}`} className="border-t">
                      <td className="px-4 py-2">
                        <Badge variant="outline">{r.attrSource ?? '—'}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="secondary">{r.attrMedium ?? '—'}</Badge>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{r._count._all}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{rupees(revenue)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{rupees(aov)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{pct.toFixed(1)}%</td>
                    </tr>
                  );
                })}
                <tr className="border-t bg-muted/20 font-medium">
                  <td className="px-4 py-2" colSpan={2}>
                    Total
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">{totalOrders}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{rupees(totalRevenue)}</td>
                  <td className="px-4 py-2 text-right tabular-nums">
                    {totalOrders ? rupees(totalRevenue / totalOrders) : '—'}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ----------------------------- RECENT ORDERS WITH ATTRIBUTION ----------------------------- */}
      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent attributed orders
        </h2>
        {recent.length === 0 ? (
          <Empty
            title="None yet"
            body="Once orders carry a captured kyg_attr cookie through checkout, the 10 most recent appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Order</th>
                  <th className="px-4 py-2 text-left font-medium">Source / medium</th>
                  <th className="px-4 py-2 text-left font-medium">Campaign</th>
                  <th className="px-4 py-2 text-left font-medium">Landed on</th>
                  <th className="px-4 py-2 text-right font-medium tabular-nums">Total</th>
                  <th className="px-4 py-2 text-left font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-xs">{o.orderNumber}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">{o.attrSource}</Badge>
                        <Badge variant="secondary">{o.attrMedium}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {o.campaign ? (
                        <span>
                          {o.campaign.name} <code className="text-muted-foreground">({o.campaign.slug})</code>
                        </span>
                      ) : o.attrCampaign ? (
                        <code className="text-muted-foreground">{o.attrCampaign}</code>
                      ) : (
                        <Muted>—</Muted>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{o.attrLandingPath ?? '—'}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{rupees(o.total)}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {o.createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/10 p-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}
