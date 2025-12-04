
"use client";

import VolunteerSidebar from "./components/volunteer-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser, useDoc } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UserProfile } from "@/lib/types";

export default function VolunteerLayout({
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
      // If loading is complete and there is no user, or user does not have a valid role, redirect.
      if (!user || !userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Volunteer')) {
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
  
  // If user is not logged in or does not have a valid profile/role, show nothing (will be redirected).
  if (!user || !userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Volunteer')) {
      return null;
  }
  
   // Admins have access to everything. If they navigate to the volunteer section, just let them.
   // Volunteers are restricted to the volunteer section.

  return (
    <SidebarProvider>
      <VolunteerSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
