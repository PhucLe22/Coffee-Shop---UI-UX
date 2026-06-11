"use client";

import * as React from "react";
import {
  LayoutDashboard,
  UsersRound,
  Store,
  ChartNoAxesCombined,
  Megaphone,
  Boxes,
  LogOut,
  ChevronRight,
  Truck,
  ClipboardList,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/shared/ui/sidebar";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { useStaffAuthStore, AuthService } from "@/shared/auth";

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
    title: "Staff Management",
    url: "/internal/staff",
    icon: UsersRound,
  },
  {
    title: "Store Locations",
    url: "/internal/locations",
    icon: Store,
  },
  {
    title: "Analytics",
    url: "/internal/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Inventory",
    url: "/internal/inventory",
    icon: Boxes,
  },
  {
    title: "Promotion",
    url: "/internal/promotion",
    icon: Megaphone,
  },
  {
    title: "Settings",
    url: "/internal/settings",
    icon: Settings,
  },
];

export function InternalSidebar() {
  const pathname = usePathname();
  const { user, logout, accessToken, refreshToken } = useStaffAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (accessToken && refreshToken) {
        await AuthService.logout(accessToken, refreshToken);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <Sidebar className="bg-surface-accent border-r-0 rounded-md overflow-hidden m-md h-[calc(100vh-2rem)] shadow-sm">
      <SidebarHeader className="p-lg pt-xl">
        <div className="flex flex-col gap-xs">
          <h1 className="text-h4-bold text-text-primary">The Collective</h1>
          <p className="text-body-sm-semibold text-text-primary opacity-80 font-inter">Admin Console</p>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-lg">
        <SidebarMenu className="gap-xs">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                className={cn(
                  "h-10 rounded-md px-md transition-all duration-200",
                  pathname === item.url 
                    ? "bg-white text-brand-primary border border-brand-primary shadow-sm" 
                    : "text-text-muted hover:bg-surface-muted hover:text-text-primary"
                )}
              >
                <Link href={item.url} className="flex items-center gap-md">
                  <item.icon className="size-6 shrink-0" />
                  <span className="text-body-sm-semibold whitespace-nowrap">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-lg pb-xl gap-lg">
        <Button 
          asChild
          className="w-full bg-brand-primary hover:bg-brand-accent text-white rounded-md h-12 gap-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          <Link href="/internal/orders/create">
            <ClipboardList className="size-6" />
            <span className="label-button-md">Create New Order</span>
          </Link>
        </Button>

        <div className="flex items-center justify-between p-sm rounded-md bg-white/50 border border-border-primary-50 backdrop-blur-sm overflow-hidden">
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-8 text-text-muted hover:text-error hover:bg-error/10 transition-colors shrink-0"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
