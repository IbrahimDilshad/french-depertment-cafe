
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
      // If loading is complete and there is no user, or user is not an Admin/Volunteer, redirect.
      if (!user || !userProfile || (userProfile.role !== 'Admin' && userProfile.role !== 'Volunteer')) {
        router.push("/login");
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // A special case: if an Admin visits a volunteer page, redirect them to the main admin dashboard.
  // This prevents confusion. Volunteers stay in the volunteer section.
   if (userProfile.role === 'Admin') {
     router.push('/admin');
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <p>Redirecting to admin dashboard...</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary ml-4" />
        </div>
     );
   }

  return (
    <SidebarProvider>
      <VolunteerSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
