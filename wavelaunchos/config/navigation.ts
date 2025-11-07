import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  BookOpen,
  ClipboardList,
  FileBarChart,
  FileText,
  Folder,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Plug,
  Settings,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const dashboardNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
  {
    title: "Files",
    href: "/dashboard/files",
    icon: Folder,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: FileBarChart,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const dashboardSecondaryNav: NavItem[] = [
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Help Center",
    href: "/dashboard/help",
    icon: LifeBuoy,
  },
  {
    title: "System Status",
    href: "/dashboard/status",
    icon: Activity,
  },
];

export const dashboardResourceNav: NavItem[] = [
  {
    title: "Business Plans",
    href: "/dashboard/resources/business-plans",
    icon: BookOpen,
  },
  {
    title: "Deliverables",
    href: "/dashboard/resources/deliverables",
    icon: ClipboardList,
  },
  {
    title: "Integrations",
    href: "/dashboard/resources/integrations",
    icon: Plug,
  },
  {
    title: "Support",
    href: "/dashboard/resources/support",
    icon: HelpCircle,
  },
];
