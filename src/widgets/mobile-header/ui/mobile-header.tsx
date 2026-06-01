"use client";

import { Menu, ShoppingCart, User } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useAuthStore } from "@/shared/auth";
import { useCartStore } from "@/entities/cart";
import Link from "next/link";

export interface MobileHeaderProps {
  className?: string;
}

const MobileHeader = ({
  className,
}: MobileHeaderProps) => {
  const { user } = useAuthStore();
  const { items, _hasHydrated } = useCartStore();

  const totalItems = _hasHydrated ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <header
      className={cn(
        "flex h-[72px] w-full items-center justify-between bg-surface-muted px-md py-sm sticky top-0 z-50",
        className,
      )}>
      <div className="flex items-center gap-md">
        {/* Menu Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-text-primary hover:bg-transparent">
          <Menu className="size-4" />
        </Button>

        {/* Brand Text */}
        <Link href="/">
          <h1 className="text-brand-mobile text-text-primary">VERDANT</h1>
        </Link>
      </div>

      <div className="flex items-center gap-sm">
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <ShoppingCart className="size-5 text-text-primary" />
            {totalItems > 0 && (
              <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-brand-primary text-[8px] font-bold text-inverse-text">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>

        {user ? (
          <Link href="/profile">
            <div className="flex size-9 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-bold text-brand-primary border border-brand-primary/20 shadow-sm active:scale-95 transition-all">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="size-5 text-text-primary" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
