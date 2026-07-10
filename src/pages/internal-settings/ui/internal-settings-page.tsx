"use client";

import React from "react";
import { 
  User, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Star,
  CreditCard,
  Apple,
  History,
  Coffee,
  Heart
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { cn } from "@/shared/lib/utils";
import { useStaffAuthStore, AuthService } from "@/shared/auth";
import { useRouter } from "next/navigation";

export default function InternalSettingsPage() {
  const { logout, accessToken, refreshToken } = useStaffAuthStore();
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
    <div className="flex flex-col h-full bg-surface-main overflow-y-auto no-scrollbar pb-xl">
      {/* Profile Header */}
      <div className="p-xl flex flex-col items-center text-center space-y-md">
        <div className="relative group">
          <Avatar className="size-32 border-4 border-white shadow-xl">
            <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 size-8 bg-brand-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Star className="size-4 text-white fill-white" />
          </div>
        </div>
        <div className="space-y-1">
          <h1 className="text-h2-bold text-text-primary">Julian Barnes</h1>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-surface-accent text-brand-primary font-bold tracking-widest uppercase text-[10px] px-3">
              Gold Member Staff
            </Badge>
          </div>
        </div>
      </div>

      {/* Loyalty Points Card */}
      <div className="px-md lg:px-xl mb-xl">
        <Card className="rounded-[24px] bg-surface-accent border-none shadow-sm overflow-hidden p-xl space-y-lg relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-text-secondary text-[10px] font-extrabold uppercase tracking-[0.2em]">Loyalty Points</p>
              <div className="flex items-baseline gap-1">
                <span className="text-display-sm text-text-primary">2,450</span>
                <span className="text-body-md-semibold text-text-secondary">pts</span>
              </div>
            </div>
            <p className="text-text-secondary text-body-sm-semibold">550 pts to Platinum</p>
          </div>
          <div className="space-y-2">
            <Progress value={75} className="h-3 bg-white/50" />
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest text-right">75% Complete</p>
          </div>
        </Card>
      </div>

      {/* Account Settings List */}
      <div className="px-md lg:px-xl space-y-md">
        <h2 className="text-h4-bold text-text-primary px-xs mb-sm">Account Settings</h2>
        
        <div className="space-y-sm">
          {[
            { icon: User, label: "Thông Tin Cá Nhân", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Bell, label: "Cài Đặt Thông Báo", color: "text-orange-500", bg: "bg-orange-50" },
            { icon: ShieldCheck, label: "Bảo Mật & Riêng Tư", color: "text-green-500", bg: "bg-green-50" },
            { icon: History, label: "Lịch Sử & Nhật Ký", color: "text-purple-500", bg: "bg-purple-50" },
          ].map((item, idx) => (
            <Button 
              key={idx}
              variant="ghost" 
              className="w-full h-16 rounded-[20px] bg-white border border-text-muted/5 shadow-sm hover:shadow-md hover:bg-surface-accent transition-all justify-between px-md group"
            >
              <div className="flex items-center gap-md">
                <div className={cn("size-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("size-5", item.color)} />
                </div>
                <span className="text-body-md-semibold text-text-primary">{item.label}</span>
              </div>
              <ChevronRight className="size-5 text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </Button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-md lg:px-xl mt-xl space-y-md">
        <h2 className="text-h4-bold text-text-primary px-xs mb-sm">Staff Perks & Payment</h2>
        <Card className="rounded-[24px] bg-text-primary border-none p-xl flex items-center justify-between group cursor-pointer hover:bg-black transition-colors">
          <div className="flex items-center gap-md">
            <div className="size-12 rounded-full bg-white/10 flex items-center justify-center">
              <CreditCard className="size-6 text-white" />
            </div>
            <div className="flex flex-col">
              <p className="text-white text-body-md-bold">•••• 4242</p>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Visa Preferred</p>
            </div>
          </div>
          <ChevronRight className="size-5 text-white/40 group-hover:text-white transition-colors" />
        </Card>
      </div>

      {/* Sign Out */}
      <div className="px-md lg:px-xl mt-xl">
        <Button 
          variant="ghost" 
          className="w-full h-16 rounded-[20px] bg-error/5 border border-error/10 text-error hover:bg-error hover:text-white transition-all justify-start px-md gap-md group"
          onClick={handleLogout}
        >
          <div className="size-10 rounded-full bg-error/10 flex items-center justify-center group-hover:bg-white/20">
            <LogOut className="size-5" />
          </div>
          <span className="text-body-md-bold uppercase tracking-widest text-[12px]">Sign Out</span>
        </Button>
      </div>

      <div className="mt-xl text-center px-xl">
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.3em]">The Collective Staff Console v2.1.4</p>
      </div>
    </div>
  );
}
