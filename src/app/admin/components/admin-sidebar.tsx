"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Coffee,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Megaphone,
  LogOut,
} from "lucide-react";
import Logo from "@/components/logo";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/menu",
    label: "Menu",
    icon: Coffee,
  },
  {
    href: "/admin/stock",
    label: "Stock",
    icon: Boxes,
  },
  {
    href: "/admin/pre-orders",
    label: "Pre-orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/volunteers",
    label: "Volunteers",
    icon: Users,
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
           <Logo className="text-sidebar-foreground" />
           <SidebarTrigger/>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                    <Link href="/">
                        <LogOut />
                        <span>Logout</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
