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
  ChartNoAxesCombined,
  Boxes,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { useStaffAuthStore, AuthService } from "@/shared/auth";
import * as React from "react";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

const mainItems = [
  {
    title: "Dashboard",
    url: "/internal/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Orders",
    url: "/internal/orders",
    icon: ClipboardList,
    roles: ["ADMIN", "MANAGER", "STAFF", "KITCHEN", "CASHIER"],
  },
  {
    title: "Inventory",
    url: "/internal/inventory",
    icon: Boxes,
    roles: ["ADMIN", "MANAGER", "STAFF"],
  },
];

const otherItems = [
  {
    title: "Delivery",
    url: "/internal/delivery",
    icon: Truck,
    roles: ["SHIPPER"],
  },
  {
    title: "Staff Management",
    url: "/internal/staff",
    icon: UsersRound,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Store Locations",
    url: "/internal/locations",
    icon: Store,
    roles: ["ADMIN", "MANAGER"],
  },
  {
    title: "Analytics",
    url: "/internal/analytics",
    icon: ChartNoAxesCombined,
    roles: ["ADMIN"],
  },
  {
    title: "Promotion",
    url: "/internal/promotion",
    icon: Megaphone,
    roles: ["ADMIN"],
  },
  {
    title: "Settings",
    url: "/internal/settings",
    icon: Settings,
    roles: ["ADMIN", "MANAGER", "SHIPPER"],
  },
];

export function InternalMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, accessToken, refreshToken } = useStaffAuthStore();
  const [open, setOpen] = React.useState(false);

  const filteredMain = React.useMemo(() => {
    if (!user?.role) return [];
    const userRole = user.role.toUpperCase();
    return mainItems.filter((item) => item.roles.includes(userRole));
  }, [user?.role]);

  const filteredOther = React.useMemo(() => {
    if (!user?.role) return [];
    const userRole = user.role.toUpperCase();
    return otherItems.filter((item) => item.roles.includes(userRole));
  }, [user?.role]);

  const handleLogout = async () => {
    try {
      if (accessToken && refreshToken) {
        await AuthService.logout(accessToken, refreshToken);
      }
    } catch {
      // ignore
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[100] h-[87px] bg-surface-accent border-t border-border-primary-50/10 flex items-center px-sm safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around w-full gap-xs overflow-x-auto no-scrollbar">
          {filteredMain.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 h-[55px] px-md rounded-xl transition-all duration-300 shrink-0",
                  isActive
                    ? "bg-brand-primary text-white shadow-lg scale-105"
                    : "text-text-secondary hover:bg-surface-muted/50 active:scale-95",
                )}
              >
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

          {filteredOther.length > 0 && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 h-[55px] px-md rounded-xl transition-all duration-300 shrink-0",
                    open
                      ? "bg-brand-primary text-white shadow-lg scale-105"
                      : "text-text-secondary hover:bg-surface-muted/50 active:scale-95",
                  )}
                >
                  <Menu className={cn("size-5", open ? "" : "opacity-80")} strokeWidth={open ? 2.5 : 2} />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.1em]">More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-surface-accent border-r border-border-primary-50/20">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-lg border-b border-border-primary-50/10">
                    <div className="flex flex-col gap-xs">
                      <h1 className="text-h4-bold text-text-primary">The Collective</h1>
                      <p className="text-body-sm-semibold text-text-primary opacity-80 font-inter">Admin Console</p>
                    </div>
                    <SheetClose asChild>
                      <button className="size-8 flex items-center justify-center rounded-md hover:bg-surface-muted text-text-muted transition-colors">
                        <X className="size-5" />
                      </button>
                    </SheetClose>
                  </div>

                  <div className="flex-1 overflow-y-auto p-lg">
                    <div className="flex flex-col gap-1">
                      {filteredOther.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                          <SheetClose key={item.title} asChild>
                            <Link
                              href={item.url}
                              className={cn(
                                "flex items-center gap-md h-10 rounded-md px-md transition-all duration-200",
                                isActive
                                  ? "bg-white text-brand-primary border border-brand-primary shadow-sm"
                                  : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                              )}
                            >
                              <item.icon className="size-5 shrink-0" />
                              <span className="text-body-sm-semibold whitespace-nowrap">{item.title}</span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-lg border-t border-border-primary-50/10 flex flex-col gap-lg">
                    {user?.role?.toUpperCase() !== "SHIPPER" && (
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full bg-brand-primary hover:bg-brand-accent text-white rounded-md h-12 gap-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
                        >
                          <Link href="/internal/orders/create">
                            <ClipboardList className="size-5" />
                            <span className="label-button-md">Create New Order</span>
                          </Link>
                        </Button>
                      </SheetClose>
                    )}

                    <div className="flex items-center justify-between p-sm rounded-md bg-white/50 border border-border-primary-50 backdrop-blur-sm">
                      <div className="flex items-center gap-sm min-w-0 flex-1 mr-2">
                        <Avatar className="size-10 border border-border-primary-50 shrink-0">
                          <AvatarImage src="/avatars/admin.png" alt={user?.name} />
                          <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "ST"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-body-sm-semibold text-text-primary truncate">{user?.name}</span>
                          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold truncate">{user?.role || "Staff"}</span>
                        </div>
                      </div>
                      <button
                        className="size-8 flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors shrink-0"
                        onClick={handleLogout}
                      >
                        <LogOut className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </>
  );
}
