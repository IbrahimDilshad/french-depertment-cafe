
"use client";

import AdminSidebar from "./components/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/lib/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const { data: userProfile, loading: profileLoading } = useDoc<UserProfile>(user ? `users/${user.uid}`: null);
  const router = useRouter();

  const loading = authLoading || profileLoading;

  useEffect(() => {
    // Redirect if loading is complete and user is not an Admin.
    if (!loading) {
        if (!user || !userProfile || userProfile.role !== 'Admin') {
            router.push("/login");
        }
    }
  }, [user, userProfile, loading, router]);

  // While loading auth status or profile, show a spinner.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is not an admin, show nothing (will be redirected).
  if (!userProfile || userProfile.role !== 'Admin') {
      return null;
  }

  // Render the admin panel for admin users.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
