import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  BOOKED: "secondary",
  AGENT_ASSIGNED: "outline",
  AGENT_EN_ROUTE: "outline",
  SAMPLE_COLLECTED: "outline",
  AT_LAB: "outline",
  REPORT_READY: "default",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function UserOrdersPage() {
  const session = await auth();
  const userId = session!.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      slotDate: true,
      slotWindow: true,
      createdAt: true,
      package: { select: { name: true } },
      agent: { select: { user: { select: { name: true } } } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every test you've booked — past and upcoming.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
            <p className="mt-4 font-medium">No orders yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Once you book a test, it'll appear here with live status updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{o.package.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">{o.orderNumber}</CardDescription>
                </div>
                <Badge variant={statusVariant[o.status] ?? "secondary"}>{o.status}</Badge>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Slot</p>
                  <p className="text-sm font-medium">
                    {new Date(o.slotDate).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                  <p className="text-xs text-muted-foreground">{o.slotWindow}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agent</p>
                  <p className="text-sm font-medium">{o.agent?.user.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Booked</p>
                  <p className="text-sm font-medium">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-medium">
                    ₹{Math.floor(o.total / 100).toLocaleString("en-IN")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
