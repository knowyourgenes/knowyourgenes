import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserReportsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const reports = await prisma.report.findMany({
    where: { userId, deliveredAt: { not: null } },
    orderBy: { deliveredAt: "desc" },
    select: {
      id: true,
      reportNumber: true,
      packageName: true,
      deliveredAt: true,
      criticalFinding: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Download the PDF or share a secure link with your doctor.
        </p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 font-medium">No reports yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Reports are delivered 7–14 days after sample collection. We'll notify you on WhatsApp + email the moment it's ready.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">{r.packageName}</CardTitle>
                  <CardDescription>
                    <span className="font-mono text-xs">{r.reportNumber}</span> · Delivered{" "}
                    {r.deliveredAt
                      ? new Date(r.deliveredAt).toLocaleDateString("en-IN", { dateStyle: "medium" })
                      : "—"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/reports/${r.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    View
                  </Link>
                  <Link
                    href="#"
                    className={buttonVariants({ size: "sm" })}
                  >
                    <Download className="h-4 w-4" /> PDF
                  </Link>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
