
"use client";

import AdminSidebar from "./components/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is complete and there is still no user,
    // redirect to the login page.
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // While loading authentication status, or if there is no user,
  // show a loading screen and prevent any content from rendering.
  // This ensures no admin content is ever briefly visible to an
  // unauthenticated user.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only if there is a logged-in user, render the admin panel.
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
