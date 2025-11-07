"use client";

import { useMemo } from "react";
import { ArrowUpRight, CreditCard, Download, Receipt, Shield, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PLAN = {
  name: "Scale",
  price: "$449",
  interval: "per month",
  seats: 25,
  renewal: "Dec 1, 2025",
  status: "Active",
};

const ADDONS = [
  { id: "storage", label: "Extra storage", price: "$29 / month", enabled: true },
  { id: "analytics", label: "Advanced analytics", price: "$59 / month", enabled: true },
  { id: "priority", label: "Priority support", price: "$79 / month", enabled: false },
];

const INVOICES = [
  { id: "INV-1024", period: "Oct 2025", amount: "$449.00", status: "Paid", issued: "Oct 01" },
  { id: "INV-1015", period: "Sep 2025", amount: "$507.99", status: "Paid", issued: "Sep 01" },
  { id: "INV-1006", period: "Aug 2025", amount: "$507.99", status: "Paid", issued: "Aug 01" },
];

export default function BillingPage() {
  const totalAddons = useMemo(() => ADDONS.filter((addon) => addon.enabled).length, []);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">Manage subscription details, payment methods, and invoices.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Download className="h-4 w-4" />
            Export invoices
          </Button>
          <Button className="gap-2 shadow-none">
            <ArrowUpRight className="h-4 w-4" />
            Upgrade plan
          </Button>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border-border/60 bg-card/90 shadow-none">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold">Current plan</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">You are on the {PLAN.name} plan.</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full px-3 text-xs text-muted-foreground">
              {PLAN.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/40 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Price</p>
              <p className="text-2xl font-semibold text-foreground">{PLAN.price}</p>
              <p className="text-xs text-muted-foreground">{PLAN.interval}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Seats</p>
              <p className="text-2xl font-semibold text-foreground">{PLAN.seats}</p>
              <p className="text-xs text-muted-foreground">Used by 19 members</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Next renewal</p>
              <p className="text-lg font-semibold text-foreground">{PLAN.renewal}</p>
            </div>
            <div className="rounded-lg border border-border/40 bg-muted/10 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Add-ons</p>
              <p className="text-lg font-semibold text-foreground">{totalAddons} enabled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Payment method</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Update payment details securely.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background/60">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Visa ending 4024</p>
                <p className="text-xs text-muted-foreground">Expires 06 / 27 · Primary</p>
              </div>
              <Button variant="outline" size="sm" className="border-border/60 text-muted-foreground hover:text-foreground">Update</Button>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="card-name">Cardholder name</Label>
              <Input id="card-name" placeholder="WaveLaunch Admin" className="bg-muted/30" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="card-email">Billing email</Label>
              <Input id="card-email" type="email" placeholder="finance@wavelaunchos.com" className="bg-muted/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Add-ons</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Toggle optional modules to match your workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {ADDONS.map((addon) => (
            <div key={addon.id} className="space-y-2 rounded-lg border border-border/40 bg-muted/10 p-4">
              <p className="text-sm font-semibold text-foreground">{addon.label}</p>
              <p className="text-xs text-muted-foreground">{addon.price}</p>
              <Button
                variant={addon.enabled ? "outline" : "secondary"}
                className={addon.enabled ? "border-border/60 text-muted-foreground hover:text-foreground" : "text-xs"}
              >
                {addon.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/90 shadow-none">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Invoice history</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Download past billing documents for compliance.</CardDescription>
          </div>
          <Button variant="ghost" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
            <Receipt className="h-4 w-4" />
            View statement
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Invoice</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Period</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Amount</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Status</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">Issued</TableHead>
                <TableHead className="w-32 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.id} className="border-border/30 transition-colors hover:bg-muted/10">
                  <TableCell className="font-medium text-foreground">{invoice.id}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.period}</TableCell>
                  <TableCell className="text-muted-foreground">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full px-2 text-xs text-emerald-300">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{invoice.issued}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/90 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Billing support</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Need help with invoices or renewals? Reach our finance team.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/60 text-muted-foreground hover:text-foreground">
            <Wallet className="h-4 w-4" />
            Update payment terms
          </Button>
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Shield className="h-4 w-4" />
            View SLA
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
