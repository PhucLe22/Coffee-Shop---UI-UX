"use client";

import { useIsMobile } from "@/shared/lib";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { MobileHeader } from "@/widgets/mobile-header";
import { MobileNavBar } from "@/widgets/mobile-nav-bar";

export default function ResponsiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isProductDetailPage =
    pathname?.startsWith("/products/") && pathname !== "/products";

  const getActiveTab = () => {
    if (pathname === "/") return "home";
    if (pathname?.startsWith("/menu")) return "menu";
    if (pathname?.startsWith("/orders")) return "orders";
    if (pathname?.startsWith("/profile")) return "profile";
    if (pathname?.startsWith("/cart")) return "cart";
    return "home";
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isInternalPage = pathname?.startsWith("/internal");

  // Prevent hydration mismatch by returning a skeleton or null until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-main" />
    );
  }

  if (isAuthPage || isInternalPage) {
    return (
      <main className="flex min-h-screen flex-col">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile ? <MobileHeader /> : <Header />}

      <main className="flex flex-1 flex-col">
        {children}
      </main>

      {isMobile ? (
        <>
          {!isProductDetailPage && <MobileNavBar activeTab={getActiveTab()} />}
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
}
