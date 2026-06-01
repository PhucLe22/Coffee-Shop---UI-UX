"use client";

import {
  LayoutDashboard,
  UsersRound,
  Megaphone,
  Store,
  Truck,
  PackageSearch,
  ClipboardList,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

const items = [
  {
    title: "Orders",
    url: "/internal/orders",
    icon: ClipboardList,
  },
  {
    title: "Dashboard",
    url: "/internal/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Delivery",
    url: "/internal/delivery",
    icon: Truck,
  },
  {
    title: "Staff",
    url: "/internal/staff",
    icon: UsersRound,
  },
  {
    title: "Promos",
    url: "/internal/promotion",
    icon: Megaphone,
  },
  {
    title: "Inventory",
    url: "/internal/inventory",
    icon: PackageSearch,
  },
  {
    title: "Stores",
    url: "/internal/locations",
    icon: Store,
  },
];

export function InternalMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] h-[87px] bg-[#faf2eb] border-t border-border-primary-50/10 flex items-center px-sm safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around w-full gap-xs overflow-x-auto no-scrollbar">
        {items.map((item) => {
          const isActive = pathname === item.url;
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 h-[55px] px-md rounded-xl transition-all duration-300 shrink-0",
                isActive
                  ? "bg-brand-primary text-white shadow-lg scale-105"
                  : "text-[#386661] hover:bg-surface-muted/50 active:scale-95",
              )}>
              <item.icon
                className={cn("size-5", isActive ? "" : "opacity-80")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.1em]">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
