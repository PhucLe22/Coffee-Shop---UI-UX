"use client";

import {
  LayoutDashboard,
  UsersRound,
  Megaphone,
  Store,
  Truck,
  PackageSearch,
  ClipboardList,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { useStaffAuthStore } from "@/shared/auth";
import * as React from "react";

const items = [
  {
    title: "Orders",
    url: "/internal/orders",
    icon: ClipboardList,
    roles: ["ADMIN", "MANAGER", "STAFF"],
  },
  {
    title: "Products",
    url: "/internal/inventory",
    icon: PackageSearch,
    roles: ["ADMIN", "MANAGER", "STAFF"],
  },
  {
    title: "Delivery",
    url: "/internal/delivery",
    icon: Truck,
    roles: ["ADMIN", "SHIPPER"],
  },
  {
    title: "Settings",
    url: "/internal/settings",
    icon: Settings,
    roles: ["ADMIN", "MANAGER", "STAFF", "SHIPPER"],
  },
];

export function InternalMobileNav() {
  const pathname = usePathname();
  const { user } = useStaffAuthStore();

  const filteredItems = React.useMemo(() => {
    if (!user?.role) return [];
    const userRole = user.role.toUpperCase();
    return items.filter((item) => item.roles.includes(userRole));
  }, [user?.role]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] h-[87px] bg-[#faf2eb] border-t border-border-primary-50/10 flex items-center px-sm safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around w-full gap-xs overflow-x-auto no-scrollbar">
        {filteredItems.map((item) => {
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
