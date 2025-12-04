
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser, useDoc } from "@/firebase";
import { UserProfile } from "@/lib/types";
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
    href: "/admin/team",
    label: "Team",
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
  const { user } = useUser();
  const { data: userProfile, loading } = useDoc<UserProfile>(user ? `users/${user.uid}` : null);
  
  // Temporarily show all items for initial setup until a user is logged in
  const menuItems = userProfile ? allMenuItems.filter(item => userProfile.accessiblePages?.includes(item.href)) : allMenuItems;


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
