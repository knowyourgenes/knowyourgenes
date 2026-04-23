import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your contact info up to date so we can reach you about your collection and reports.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Shown on your orders and reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={user.name ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email
                {user.emailVerified && (
                  <Badge variant="outline" className="ml-2 text-[10px]">Verified</Badge>
                )}
              </Label>
              <Input id="email" type="email" defaultValue={user.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone
                {user.phoneVerified && (
                  <Badge variant="outline" className="ml-2 text-[10px]">Verified</Badge>
                )}
              </Label>
              <Input id="phone" defaultValue={user.phone ?? ""} />
            </div>
            <div className="sm:col-span-2">
              <Button disabled>Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication preferences</CardTitle>
          <CardDescription>
            How we reach you about orders, reports, and health tips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { label: "Order updates on WhatsApp", enabled: true },
            { label: "Email receipts", enabled: true },
            { label: "Monthly newsletter", enabled: false },
            { label: "Research opt-in (anonymous)", enabled: false },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between">
              <span>{p.label}</span>
              <Badge variant={p.enabled ? "default" : "secondary"}>
                {p.enabled ? "On" : "Off"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Delete your data permanently. This cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>Request data deletion</Button>
        </CardContent>
      </Card>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
      </p>
    </div>
  );
}
