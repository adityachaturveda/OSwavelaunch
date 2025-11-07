"use client";

import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const ROLES = [
  { name: "Owner", description: "Full administration and billing oversight." },
  { name: "Admin", description: "Manage deliverables, clients, automations." },
  { name: "Reviewer", description: "Comment and approve deliverables." },
];

const ACTIVITY = [
  { id: "1", label: "Signed in", meta: "New device · Chrome on Windows", time: "2 minutes ago" },
  { id: "2", label: "Updated plan", meta: "Switched to Scale plan", time: "Yesterday" },
  { id: "3", label: "Created automation", meta: "Deliverable ready → Slack", time: "Nov 01" },
];

export default function AccountPage() {
  const [bio, setBio] = useState("Helping creative teams orchestrate launches with WaveLaunch OS.");
  const initials = useMemo(() => "WaveLaunch Admin".split(" ").map((part) => part[0]).join(""), []);

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Account</h1>
          <p className="text-sm text-muted-foreground">Manage your personal details, security settings, and session history.</p>
        </div>
        <Button className="gap-2 shadow-none">Save profile</Button>
      </header>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="overflow-x-auto bg-muted/30">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Recent activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-foreground">Profile overview</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Update name, title, and contact links.</CardDescription>
              </div>
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarImage alt="WaveLaunch Admin" src="/avatar/admin.png" />
                <AvatarFallback className="rounded-xl text-lg font-semibold">{initials}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="WaveLaunch Admin" className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@wavelaunchos.com" className="bg-muted/30" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="resize-none bg-muted/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Role & permissions</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Current access level and capabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className="rounded-full px-3 text-xs text-muted-foreground">Admin</Badge>
              <div className="grid gap-3 sm:grid-cols-3">
                {ROLES.map((role) => (
                  <div key={role.name} className="rounded-lg border border-border/40 bg-muted/10 p-4">
                    <p className="text-sm font-semibold text-foreground">{role.name}</p>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Security controls</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Manage passwords, 2FA, and recovery options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 27 days ago</p>
                </div>
                <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">Update</Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4">
                <div>
                  <p className="text-sm font-medium">Two-factor authentication</p>
                  <p className="text-xs text-muted-foreground">Authenticator app enabled</p>
                </div>
                <Button variant="outline" className="border-border/60 text-muted-foreground hover:text-foreground">Manage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Latest events tied to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ACTIVITY.map((event) => (
                <div key={event.id} className="flex items-start justify-between rounded-lg border border-border/40 bg-muted/10 p-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{event.meta}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
