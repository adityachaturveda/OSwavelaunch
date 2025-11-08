import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { requireAdmin } from "@/lib/auth/guards";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // TEMPORARY: Auth disabled for testing
  // await requireAdmin({ callbackUrl: "/dashboard" });

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 lg:px-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <SidebarTrigger className="lg:hidden" />
            <span className="text-xs font-medium text-muted-foreground lg:text-sm">
              Wavelaunch Studio, a product of Wavelaunch VC
            </span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col text-foreground">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
