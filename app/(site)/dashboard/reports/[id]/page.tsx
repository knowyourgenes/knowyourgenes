import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertTriangle, FileText } from 'lucide-react';

import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ReportDownloadButton } from '@/features/reports/components/ReportDownloadButton';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

/**
 * /dashboard/reports/[id] - one report.
 *
 * THE REPORTS LIST HAS LINKED HERE SINCE IT WAS WRITTEN and the route did not
 * exist, so every "View" button on every delivered report was a 404 - the last
 * step of the whole chain, broken for the person who paid for it. The list's
 * second button was worse: `href="#"`.
 *
 * Ownership is checked here rather than trusted from the URL, and an unowned or
 * unreleased report answers notFound() - the same answer as a report that does
 * not exist. Anything else lets someone walk cuids and learn which ones are real.
 */
export default async function ReportPage({ params }: { params: Params }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) notFound();

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      id: true,
      reportNumber: true,
      packageName: true,
      summary: true,
      criticalFinding: true,
      deliveredAt: true,
      userId: true,
      order: { select: { orderNumber: true } },
      markers: {
        select: { id: true, name: true, gene: true, result: true, summary: true, action: true },
        orderBy: { position: 'asc' },
      },
    },
  });

  // Not yours, or not released yet, reads exactly like not there.
  if (!report || report.userId !== userId || !report.deliveredAt) notFound();

  const bullets = Array.isArray(report.summary) ? (report.summary as string[]) : [];

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/reports"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All reports
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{report.packageName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-mono">{report.reportNumber}</span> · Order {report.order.orderNumber} · Delivered{' '}
            {new Date(report.deliveredAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
          </p>
        </div>
        <ReportDownloadButton reportId={report.id} label="Open PDF" />
      </div>

      {report.criticalFinding && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">This report contains a finding worth discussing</p>
              <p className="mt-1 text-muted-foreground">
                A genetic counsellor can walk you through what it does and does not mean. Booking a call is free and
                there is no obligation.
              </p>
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-3' })}
              >
                Talk to a counsellor
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {bullets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">In plain language</CardTitle>
            <CardDescription>The short version. The full detail is in the PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {report.markers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">What was measured</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.markers.map((m) => (
              <div key={m.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{m.gene}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {m.result}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{m.summary}</p>
                {m.action && <p className="mt-1 text-sm">{m.action}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {bullets.length === 0 && report.markers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 font-medium">Your report is ready to read</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              The full report is in the PDF. Open it above, or save it to share with your doctor.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
