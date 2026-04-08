"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileHeader from "@/components/Mobile/header";
import MobileNavBar from "@/components/Mobile/nav-bar";
import AddToCart from "../Mobile/product/add-to-cart";

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

  // Prevent hydration mismatch by returning a skeleton or null until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-main" />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {isMobile && <MobileHeader />}

      {!isMobile && (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-brand-primary" />
              <span className="text-xl font-bold tracking-tighter uppercase">Ritual Coffee</span>
            </div>
            <nav className="flex items-center gap-8 text-sm font-medium text-text-secondary">
              <a href="/" className="hover:text-brand-primary transition-colors">Home</a>
              <a href="/menu" className="hover:text-brand-primary transition-colors">Menu</a>
              <a href="/rewards" className="hover:text-brand-primary transition-colors">Rewards</a>
              <a href="/stores" className="hover:text-brand-primary transition-colors">Stores</a>
            </nav>
            <div className="flex items-center gap-4">
              <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-text-primary hover:bg-slate-200 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>

      {isMobile && !isProductDetailPage && <MobileNavBar />}
      {isMobile && isProductDetailPage && <AddToCart price={50} />}
      
      {!isMobile && (
        <footer className="border-t bg-slate-50 py-12">
          <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
            © 2026 Ritual Coffee Co. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}
