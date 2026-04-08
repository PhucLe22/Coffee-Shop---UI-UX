import React from "react";
import { House, Coffee, ScrollText, User, ShoppingCart } from "lucide-react";
import { cn } from "@/shared/lib";
import Link from "next/link";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon: Icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-[51px] w-[83px] flex-col items-center justify-center gap-1 rounded-sm transition-all",
        isActive ? "bg-text-primary text-text-inverse" : "text-text-secondary"
      )}
    >
      <Icon className="size-4" />
      <span className="font-inter text-[10px] font-bold uppercase leading-none">
        {label}
      </span>
    </Link>
  );
};

export interface MobileNavBarProps {
  activeTab?: "home" | "menu" | "orders" | "profile" | "cart";
  className?: string;
}

const MobileNavBar = ({ activeTab = "home", className }: MobileNavBarProps) => {
  const navItems = [
    { id: "home", label: "HOME", icon: House, href: "/" },
    { id: "menu", label: "MENU", icon: Coffee, href: "/menu" },
    { id: "orders", label: "ORDERS", icon: ScrollText, href: "/orders" },
    { id: "profile", label: "PROFILE", icon: User, href: "/profile" },
    { id: "cart", label: "CART", icon: ShoppingCart, href: "/cart" },
  ];

  return (
    <nav
      className={cn(
        "flex h-[67px] w-full items-center justify-between bg-surface-muted px-4",
        className
      )}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={activeTab === item.id}
        />
      ))}
    </nav>
  );
};

export default MobileNavBar;
