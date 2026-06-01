"use client";

import React from "react";
import { SidebarProvider } from "@/shared/ui/sidebar";
import { InternalSidebar } from "./internal-sidebar";
import { InternalMobileNav } from "./internal-mobile-nav";
import { useIsMobile } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="relative flex min-h-screen w-full bg-surface-main">
        {!isMobile && <InternalSidebar />}
        <main className={cn(
          "flex-1 flex flex-col min-w-0",
          isMobile && "pb-[87px]"
        )}>
          <div className="flex-1">
            {children}
          </div>
        </main>
        {isMobile && <InternalMobileNav />}
      </div>
    </SidebarProvider>
  );
}
