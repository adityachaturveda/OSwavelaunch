"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/config/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [] as { href: string; label: string; isCurrent: boolean }[];

    const segments = pathname.split("/").filter(Boolean);
    const navLookup = new Map(
      dashboardNavItems.map((item) => [item.href.replace(/\/$/, ""), item.title])
    );

    const crumbs = segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const normalizedHref = href.replace(/\/$/, "");
      const label = navLookup.get(normalizedHref) ?? segment.replace(/-/g, " ");

      return {
        href,
        label,
        isCurrent: index === segments.length - 1,
      };
    });

    return crumbs;
  }, [pathname]);

  const currentTitle = breadcrumbs.at(-1)?.label ?? "Dashboard";

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-14 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.length === 0 ? (
                <BreadcrumbItem>
                  <span className="text-sm text-muted-foreground">Dashboard</span>
                </BreadcrumbItem>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    <Link
                      href={crumb.href}
                      className={
                        crumb.isCurrent
                          ? "text-sm font-medium text-foreground"
                          : "text-sm text-muted-foreground hover:text-foreground"
                      }
                    >
                      {crumb.label}
                    </Link>
                    {index < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                  </BreadcrumbItem>
                ))
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-foreground/90">
            {currentTitle}
          </h1>
        </div>
      </div>
    </header>
  );
}
