
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
} from "lucide-react";
import Logo from "@/components/logo";

const allMenuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    href: "/admin/menu",
    label: "Menu",
    icon: Coffee,
    roles: ["admin"],
  },
  {
    href: "/admin/stock",
    label: "Stock",
    icon: Boxes,
    roles: ["admin", "volunteer"],
  },
  {
    href: "/admin/pre-orders",
    label: "Pre-orders",
    icon: ShoppingCart,
    roles: ["admin", "volunteer"],
  },
  {
    href: "/admin/team",
    label: "Team",
    icon: Users,
    roles: ["admin"],
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: Megaphone,
    roles: ["admin"],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  // Assuming admin role for now to show all items
  const userRole = "admin"; 
  
  const menuItems = allMenuItems.filter(item => userRole && item.roles.includes(userRole));

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
      </SidebarFooter>
    </Sidebar>
  );
}
