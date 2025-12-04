
"use client";

import VolunteerSidebar from "./components/volunteer-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <VolunteerSidebar />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
