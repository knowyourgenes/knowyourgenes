import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

import { prisma } from '@/server/prisma';
import { auth } from '@/features/auth';
import { presignDownload } from '@/features/reports';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ReportDownloadButton } from '@/features/reports/components/ReportDownloadButton';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

/**
 * /dashboard/reports/[id] - reading one report.
 *
 * THE PAGE READS THE REPORT, it does not describe it. An earlier version showed
 * a title, an id, a date and a line saying the real thing was in the PDF - which
 * made it a signpost, and a signpost between someone and their own results is
 * just a click. `summary` and `markers` are empty on every report today because
 * a lab uploads a PDF and nothing else, so there was never going to be anything
 * else to show.
 *
 * So the PDF is embedded. Storage serves it as `Content-Disposition: inline`,
 * which means the browser's own viewer renders it here - scroll, search, zoom,
 * print - with no PDF library and nothing added to the bundle.
 *
 * THE URL IS SIGNED ON THE SERVER, in this render, and lives ten minutes. It is
 * never in the page source at build time and never in browser history, because
 * the page is dynamic and the iframe src is generated per request. Open PDF
 * stays for saving a copy or reading full-screen.
 *
 * Ownership is checked here rather than trusted from the URL, and an unowned or
 * unreleased report answers notFound() - the same answer as one that does not
 * exist, so walking ids reveals nothing.
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
      pdfKey: true,
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

  if (!report || report.userId !== userId || !report.deliveredAt) notFound();

  // Signed per request. If storage is unreachable the page still renders - the
  // reader gets the download button and the counsellor link rather than an error
  // page for something that is only the viewer being unavailable.
  let pdfUrl: string | null = null;
  try {
    pdfUrl = await presignDownload(report.pdfKey, 600);
  } catch (err) {
    console.error(`[report ${report.reportNumber}] could not presign for inline view:`, err);
  }

  const bullets = Array.isArray(report.summary) ? (report.summary as string[]) : [];

  return (
    <div className="space-y-5">
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
        <ReportDownloadButton reportId={report.id} label="Open full screen" variant="outline" />
      </div>

      {report.criticalFinding && (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">This report contains a finding worth discussing</p>
              <p className="mt-1 text-muted-foreground">
                A genetic counsellor can walk you through what it does and does not mean. The first call is free and
                there is no obligation.
              </p>
              <Link href="/dashboard" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-3' })}>
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
            <CardDescription>The short version. The full detail is below.</CardDescription>
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

      {/* The report itself. Tall enough to actually read a page at a time rather
          than peer through a letterbox. */}
      {pdfUrl ? (
        <div className="overflow-hidden rounded-sm border bg-muted">
          <iframe
            src={pdfUrl}
            title={`Report ${report.reportNumber}`}
            className="h-[min(78vh,900px)] w-full border-0"
          />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="font-medium">The viewer could not load just now</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Your report is safe. Use Open full screen above, or try again in a moment.
            </p>
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

      <p className="text-xs leading-relaxed text-muted-foreground">
        This report is yours to keep and to share with any doctor you choose. If anything in it worries you, our genetic
        counsellors do this all day and the first call is free.
      </p>
    </div>
  );
}
