"use client";

import React from "react";
import { SidebarProvider } from "@/shared/ui/sidebar";
import { InternalSidebar } from "./internal-sidebar";
import { InternalMobileNav } from "./internal-mobile-nav";
import { useIsMobile } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { useStaffAuthStore } from "@/shared/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const { user, _hasHydrated, setAuth, accessToken, refreshToken } = useStaffAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (_hasHydrated && !user && accessToken) {
        try {
          const { data } = await AuthService.getMe();
          setAuth({ ...data, accessToken, refreshToken });
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          router.push("/login");
        }
      } else if (_hasHydrated && !user) {
        console.log("InternalLayout: Redirecting to login due to missing user");
        router.push("/login");
      }
    };
    fetchUser();
  }, [_hasHydrated, user, router, accessToken, refreshToken, setAuth]);

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-main">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

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
