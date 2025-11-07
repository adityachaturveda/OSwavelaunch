"use client";

import { useState } from "react";
import { Mail, Shield, SlidersHorizontal, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BILLING_PLANS = [
  { id: "growth", name: "Growth", price: "$249 / month", seats: "10 seats" },
  { id: "scale", name: "Scale", price: "$449 / month", seats: "25 seats" },
  { id: "enterprise", name: "Enterprise", price: "Custom", seats: "Unlimited" },
];

export default function SettingsPage() {
  const [plan, setPlan] = useState("scale");

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage account details, team access, billing, and integrations.</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="overflow-x-auto bg-muted/30">
          <TabsTrigger value="account" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <Badge variant="outline" className="rounded-full px-2 text-xs">Pro</Badge>
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Shield className="h-4 w-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Mail className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Profile</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Update primary contact information for your organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="WaveLaunch Admin" className="bg-muted/30" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@wavelaunchos.com" className="bg-muted/30" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone" className="border-border/60 bg-muted/30">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="border-border/60 bg-card/90">
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">GMT-5 (EST)</SelectItem>
                    <SelectItem value="ist">GMT+5:30 (IST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="border-border/60 bg-muted/30">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="border-border/60 bg-card/90">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Security</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Configure login credentials and account recovery preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Require OTP codes when team members sign in.</p>
                </div>
                <Checkbox defaultChecked aria-label="Toggle 2FA" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                <div>
                  <p className="text-sm font-medium">Session reminders</p>
                  <p className="text-xs text-muted-foreground">Send an email when new devices sign in.</p>
                </div>
                <Checkbox aria-label="Toggle session reminders" />
              </div>
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">
                Reset password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Team members</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Invite collaborators and manage roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {["admin@wavelaunchos.com", "ops@blueharbor.ai", "eddie@acmestudios.com"].map((member) => (
                  <Card key={member} className="border-border/40 bg-muted/10 shadow-none">
                    <CardHeader className="space-y-2">
                      <CardTitle className="text-sm font-semibold text-foreground">{member.split("@")[0]}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">{member}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                      <Badge variant="outline" className="rounded-full px-3 text-xs text-muted-foreground">
                        Admin
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                        Manage
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className="gap-2 shadow-none">Invite member</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Plan overview</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Track usage and upgrade when your team scales.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {BILLING_PLANS.map((billingPlan) => (
                <Card
                  key={billingPlan.id}
                  className={`border-border/50 bg-muted/10 shadow-none transition-colors ${
                    plan === billingPlan.id ? "border-primary/40" : "hover:border-border"
                  }`}
                  onClick={() => setPlan(billingPlan.id)}
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-sm font-semibold text-foreground">{billingPlan.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{billingPlan.price}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{billingPlan.seats}</span>
                    {plan === billingPlan.id && <Badge variant="outline">Current</Badge>}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Connected apps</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Configure webhooks, API keys, and real-time sync destinations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Slack", "HubSpot", "Notion"].map((integration) => (
                <div key={integration} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{integration}</p>
                    <p className="text-xs text-muted-foreground">Connected · Synced daily</p>
                  </div>
                  <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">
                    Manage
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notification preferences</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Decide how and when your team receives updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["New deliverable feedback", "Client messages", "Weekly analytics digest"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item}</p>
                    <p className="text-xs text-muted-foreground">Email + in-app</p>
                  </div>
                  <Checkbox defaultChecked aria-label={`Toggle ${item}`} />
                </div>
              ))}
              <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">
                Save changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
