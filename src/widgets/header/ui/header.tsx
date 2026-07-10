"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, MoveRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AppButton } from "@/shared/ui";
import { useCustomerAuthStore } from "@/shared/auth";
import { useCartStore } from "@/entities/cart";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Thực đơn", href: "/menu" },
  { label: "Cửa hàng", href: "/locations" },
  { label: "Về chúng tôi", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const { user } = useCustomerAuthStore();
  const { items, _hasHydrated } = useCartStore();

  const totalItems = _hasHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-surface-muted px-2xl h-[102px] flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-brand-desktop text-text-primary">
          VERDANT
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-xl">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-h5-bold transition-colors py-2 px-4 rounded-md",
                isActive
                  ? "text-brand-primary border border-brand-primary"
                  : "text-text-muted hover:text-text-primary",
              )}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-lg">
        <div className="flex items-center gap-md">
          <Link href="/cart">
            <AppButton variant="ghost" size="icon" className="relative">
              <ShoppingCart className="size-6" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-inverse-text">
                  {totalItems}
                </span>
              )}
            </AppButton>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-bold text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-all">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <AppButton variant="ghost" size="icon">
                <User className="size-6" />
              </AppButton>
            </Link>
          )}
        </div>

        <Link href={!user && pathname === "/" ? "/login" : "/menu"}>
          <AppButton variant="primary" className="gap-sm rounded-full px-xl">
            {!user && pathname === "/" ? "Đăng nhập" : "ĐẶT NGAY"}
            <MoveRight className="size-5" />
          </AppButton>
        </Link>
      </div>
    </header>
  );
}
