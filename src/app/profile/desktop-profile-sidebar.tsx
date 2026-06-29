"use client";

import React from "react";
import { User, ClipboardList, MapPin, CreditCard, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AppButton } from "@/shared/ui";
import { useRouter } from "next/navigation";
import { useCustomerAuthStore, AuthService } from "@/shared/auth";
import { toast } from "sonner";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex h-14 w-full items-center gap-4 px-4 transition-colors rounded-lg mb-2",
      isActive
        ? "bg-surface-inverse/10 text-text-primary"
        : "text-text-muted hover:bg-surface-inverse/5"
    )}
  >
    <Icon className={cn("size-6", isActive ? "text-text-primary" : "text-text-muted")} />
    <span className="font-plus-jakarta text-lg font-bold">{label}</span>
  </button>
);

export function DesktopProfileSidebar() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Thông tin cá nhân");
  const { user, logout, accessToken, refreshToken } = useCustomerAuthStore();

  const handleLogout = async () => {
    try {
      if (accessToken && refreshToken) {
        await AuthService.logout(accessToken, refreshToken);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      logout();
      toast.success('Đã đăng xuất');
      router.push('/');
    }
  };

  const navItems = [
    { icon: User, label: "Thông tin cá nhân", onClick: () => setActiveTab("Thông tin cá nhân") },
    { icon: ClipboardList, label: "Lịch sử đơn hàng", onClick: () => router.push("/orders") },
    { icon: MapPin, label: "Địa chỉ đã lưu", onClick: () => setActiveTab("Địa chỉ đã lưu") },
    { icon: CreditCard, label: "Phương thức thanh toán", onClick: () => setActiveTab("Phương thức thanh toán") },
  ];

  return (
    <aside className="flex w-[400px] flex-col gap-8">
      {/* Profile Card */}
      <div className="flex flex-col items-center gap-4 rounded-md bg-surface-inverse p-8 text-center text-inverse-text overflow-hidden relative">
        {/* Large Background Text Decoration */}
        <span className="absolute -bottom-4 -left-4 text-[60px] font-pacifico opacity-10 whitespace-nowrap pointer-events-none">
          {user?.name ?? "Customer"}
        </span>
        
        <div className="flex flex-col gap-1 z-10">
          <h2 className="text-h4-bold">{user?.name ?? "Customer"}</h2>
          <p className="text-body-sm-reg text-text-muted">{user?.email ?? ""}</p>
        </div>
        
        {/* Points Display (Simplified from mobile version) */}
        <div className="mt-4 flex w-full flex-col gap-2 rounded-lg bg-white/5 p-4 z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-inverse-text/60">COLLECTIVE POINTS</span>
            <span className="text-lg font-bold text-brand-primary">{user?.points?.toLocaleString() ?? 0} pts</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.label}
            onClick={() => setActiveTab(item.label)}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <AppButton variant="danger" className="mt-auto w-full font-bold" onClick={handleLogout}>
        <LogOut className="mr-2 size-5" />
        Đăng xuất
      </AppButton>
    </aside>
  );
}
