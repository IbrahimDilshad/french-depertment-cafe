
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import VolunteerSidebar from "./components/volunteer-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

function VolunteerLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 w-1/2">
           <Skeleton className="h-12 w-full" />
           <Skeleton className="h-[50vh] w-full" />
        </div>
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


export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VolunteerLayoutContent>{children}</VolunteerLayoutContent>;
}
