import Link from 'next/link';
import { AlertTriangle, ArrowRight, FileText, ShieldCheck } from 'lucide-react';

import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ReportDownloadButton } from '@/features/reports/components/ReportDownloadButton';

export const dynamic = 'force-dynamic';

/**
 * /dashboard/reports - everything this person has had read.
 *
 * A GENETIC REPORT IS NOT AN INVOICE, and this list used to look like one: three
 * identical cards, a monospace id, a date, and two buttons of equal weight. The
 * thing someone actually came here to do is open one and read it, so opening is
 * the whole row rather than a small button on the end of it, and a critical
 * finding is visible from the list rather than only after you go in.
 *
 * The header carries the one reassurance worth repeating on a page like this:
 * these are private, and the links are short-lived. People do worry about that
 * and the page is where they are thinking about it.
 */
export default async function UserReportsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const reports = await prisma.report.findMany({
    // deliveredAt is the release gate: a report a lab has filed but KYG has not
    // approved does not exist as far as the customer is concerned.
    where: { userId, deliveredAt: { not: null } },
    orderBy: { deliveredAt: 'desc' },
    select: {
      id: true,
      reportNumber: true,
      packageName: true,
      deliveredAt: true,
      criticalFinding: true,
      order: { select: { orderNumber: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reports.length === 0
              ? 'Results appear here as soon as they are ready.'
              : `${reports.length} report${reports.length === 1 ? '' : 's'}, yours to keep.`}
          </p>
        </div>
        {reports.length > 0 && (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Private to you · download links expire after 10 minutes
          </p>
        )}
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 font-medium">No reports yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Reports are delivered 7&ndash;14 days after your sample reaches the lab. We&apos;ll email you the moment
              yours is ready.
            </p>
            <Link href="/dashboard/orders" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-5' })}>
              Track your orders
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            // The whole card opens the report. A row whose only job is "open
            // this" should not make anyone aim at a 60px button.
            <Card
              key={r.id}
              className="group relative overflow-hidden transition hover:border-primary/40 hover:shadow-sm"
            >
              <CardContent className="flex flex-wrap items-center gap-4 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Stretched so the whole card is the hit area, while the
                        buttons beside it stay independently clickable. */}
                    <Link href={`/dashboard/reports/${r.id}`} className="font-medium after:absolute after:inset-0">
                      {r.packageName}
                    </Link>
                    {r.criticalFinding && (
                      <Badge variant="destructive" className="gap-1 text-[10px]">
                        <AlertTriangle className="h-3 w-3" />
                        Worth discussing
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    <span className="font-mono">{r.reportNumber}</span> · Order {r.order.orderNumber} ·{' '}
                    {new Date(r.deliveredAt!).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/*
                    ONLY THE PDF BUTTON IS LIFTED. It is the one control that must
                    beat the card-wide link, so it alone gets `relative z-10`.
                  */}
                  <div className="relative z-10">
                    <ReportDownloadButton reportId={r.id} label="PDF" variant="outline" />
                  </div>

                  {/*
                    "Read" is deliberately NOT lifted, so the stretched link
                    underneath receives the click. It used to sit inside the same
                    z-10 wrapper as the PDF button, which made the thing that
                    looks like the primary action the one part of the row that
                    did nothing - and left a dead strip with live link on either
                    side of it, which is what made the hover read as arbitrary.
                    Decoration for an affordance that lives underneath it.
                  */}
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-1.5"
                  >
                    Read
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reports.length > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Something in a report you want to talk through? Our genetic counsellors do this all day and the first call is
          free. There is a link on each report.
        </p>
      )}
    </div>
  );
}
