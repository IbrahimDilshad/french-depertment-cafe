
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
  Shield,
} from "lucide-react";
import Logo from "@/components/logo";
import { useAuth, useDoc } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { UserProfile } from "@/lib/types";

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

function AdminSidebarContent() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  // Conditionally fetch the user profile only when the user object is available.
  const { data: userProfile } = useDoc<UserProfile>(user ? `users/${user.uid}` : null);
  const userRole = userProfile?.role;
  
  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

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
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}


export default function AdminSidebar() {
  const { user, loading } = useUser();

  // We only render the sidebar content once we have a user,
  // to prevent hooks from running with null dependencies.
  if (loading || !user) {
    // You can return a skeleton loader here if you want
    return (
       <Sidebar>
        <SidebarHeader>
            <div className="flex items-center justify-between">
               <Logo className="text-sidebar-foreground" />
               <SidebarTrigger/>
            </div>
        </SidebarHeader>
       </Sidebar>
    );
  }

  return <AdminSidebarContent />;
}

