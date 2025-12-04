
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
    if (!loading) {
      // If loading is complete and there's no user, redirect to login.
      if (!user) {
        router.push("/login");
        return;
      }
      // If a profile exists and the user is NOT an admin, redirect.
      if (userProfile && userProfile.role !== "Admin") {
        router.push("/login");
        return;
      }
       // If there is a user but no profile yet (e.g. first login) redirect to login
       // to prevent access before a role is assigned.
      if (user && !userProfile) {
        router.push("/login");
        return;
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

  // If user is not logged in or doesn't have an admin profile, show nothing (will be redirected).
  if (!user || !userProfile || userProfile.role !== 'Admin') {
      return null;
  }
  
  // Only render the admin panel for a verified Admin user.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
