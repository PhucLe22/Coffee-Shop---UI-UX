"use client";

import React from "react";
import { 
  Search, 
  Plus, 
  Ticket, 
  Users, 
  Globe, 
  TrendingUp, 
  Calendar, 
  Edit3, 
  Clock, 
  Tag, 
  Zap,
  ArrowRight,
  Coffee,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

export default function PromotionsPage() {
  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-body-md-bold md:text-h3-bold text-text-primary">Promotion Management</h1>
          <p className="text-[12px] md:text-body-sm-reg text-text-secondary">Create and manage seasonal campaigns</p>
        </div>
        <div className="flex items-center gap-sm md:gap-md">
          <div className="relative flex-1 md:w-full md:max-w-xs">
            <Search className="absolute left-md top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <Input 
              placeholder="Search..." 
              className="pl-xl h-10 bg-white/50 border-border-primary-50 rounded-md focus:bg-white transition-colors"
            />
          </div>
          <Button className="bg-brand-primary hover:bg-brand-accent text-white rounded-md h-10 px-sm md:px-md gap-xs shadow-sm">
            <Plus className="size-4" />
            <span className="hidden sm:inline label-button-md text-sm">New Promotion</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {/* Hero Promo */}
        <div className="lg:col-span-2">
          <Card className="bg-[#330f00] border-0 shadow-md rounded-md overflow-hidden relative h-[320px] md:h-[400px] group">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop" 
                alt="Monday Roast" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#330f00] via-[#330f00]/60 to-transparent" />
            </div>
            <CardContent className="p-md md:p-xl relative z-10 h-full flex flex-col justify-end gap-md md:gap-lg">
              <div className="flex flex-col gap-sm md:gap-md max-w-xl">
                <div className="flex items-center gap-md">
                  <Badge className="bg-brand-primary text-white border-0 rounded-full px-md py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                    ACTIVE SELECTION
                  </Badge>
                  <span className="text-[11px] md:text-body-sm-semibold text-white/50">Seasonal Offer</span>
                </div>
                <h2 className="text-body-lg-bold md:text-h2-bold text-white leading-tight">The Monday Roast</h2>
                <p className="text-[13px] md:text-body-md-reg text-white/80 line-clamp-2 md:line-clamp-none">
                  Exclusive 25% discount on all single-origin whole beans every Monday. Driving early week footfall.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-md pt-md md:pt-lg border-t border-white/10">
                <div className="flex gap-lg md:gap-xl">
                  <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Discount</span>
                    <span className="text-body-md-bold md:text-h4-bold text-brand-primary">25% OFF</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">Expires</span>
                    <span className="text-body-md-bold md:text-h4-bold text-white">Dec 31, 2024</span>
                  </div>
                </div>
                <Button className="bg-white text-[#386661] hover:bg-surface-main rounded-md h-9 md:h-10 px-md md:px-lg font-bold transition-transform active:scale-95 text-[12px] md:text-sm">
                  Edit Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel (Tools + Performance) */}
        <div className="lg:col-span-1 flex flex-col gap-md md:gap-lg">
          <Card className="bg-surface-accent border-0 shadow-sm rounded-md overflow-hidden flex-1">
            <CardHeader className="p-md pb-xs">
              <CardTitle className="text-body-sm-semibold text-text-primary uppercase tracking-widest text-[9px] md:text-[10px] opacity-60">Promotion Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-md pt-0 flex flex-col gap-xs">
              <ToolButton icon={Ticket} label="Coupon Generator" />
              <ToolButton icon={Users} label="Member Access" />
              <ToolButton icon={Globe} label="Regional Adjustments" />
            </CardContent>
          </Card>

          <Card className="bg-[#386661] border-0 shadow-sm rounded-md overflow-hidden text-inverse-text p-lg flex flex-col justify-between gap-md min-h-[140px] md:min-h-[160px]">
            <div className="flex flex-col gap-xs">
              <span className="text-body-sm-semibold uppercase tracking-widest text-[9px] md:text-[10px] opacity-70">Campaign Performance</span>
              <h3 className="text-h3-bold md:text-h2-bold text-white">+14.2%</h3>
              <p className="text-[11px] md:text-[12px] opacity-80 leading-snug">Increase in Monday sales since campaign launch.</p>
            </div>
            <Button variant="ghost" className="text-white hover:bg-white/10 w-fit h-7 px-0 gap-xs text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
              View Reports <ArrowRight className="size-3" />
            </Button>
          </Card>
        </div>

        {/* Secondary Promo Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-md md:gap-lg">
          <PromoCard 
            image="https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=300&fit=crop"
            status="Ongoing"
            title="The Cold Brew Pass"
            description="Subscription model offering unlimited cold brew for members during summer months."
            highlight="$15 / mo"
            subHighlight="Code: COLDPASS"
          />
          <PromoCard 
            image="https://images.unsplash.com/photo-1541167760496-1628856ab752?w=400&h=300&fit=crop"
            status="New"
            statusColor="bg-brand-primary"
            title="Latte Art Workshop"
            description="Buy 1 Workshop ticket, get 50% off your second. Valid for couples and team bookings."
            highlight="50% BOGO"
            subHighlight="Code: ARTIST50"
          />
          <PromoCard 
            image="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
            status="Draft"
            statusColor="bg-surface-muted text-text-muted"
            title="Morning Pastry Pair"
            description="Free croissant with any large latte order before 9:00 AM. Launching next month."
            highlight="FREE TREAT"
            subHighlight="Status: PENDING"
          />
        </div>

        {/* Flash Sale Form */}
        <div className="lg:col-span-3">
          <Card className="bg-[#EAE1D9] border-0 shadow-sm rounded-md overflow-hidden mt-md">
            <CardContent className="p-lg md:p-xl grid grid-cols-1 lg:grid-cols-2 gap-lg md:gap-xl items-center">
              <div className="flex flex-col gap-md md:gap-lg">
                <div className="flex flex-col gap-xs">
                  <h2 className="text-body-lg-bold md:text-h3-bold text-text-primary">Launch a Flash Sale</h2>
                  <p className="text-[13px] md:text-body-md-reg text-text-secondary max-w-md">
                    Quickly deploy a store-wide discount for the next 24 hours. Perfect for quiet periods.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md md:gap-lg max-w-md">
                  <div className="flex flex-col gap-sm">
                    <label className="text-body-sm-semibold text-text-primary px-xs uppercase tracking-widest text-[9px] md:text-[10px]">Discount</label>
                    <Input placeholder="15%" className="h-11 md:h-12 bg-white rounded-md border-border-primary-50 focus:border-brand-primary transition-all px-md font-bold text-sm" />
                  </div>
                  <div className="flex flex-col gap-sm">
                    <label className="text-body-sm-semibold text-text-primary px-xs uppercase tracking-widest text-[9px] md:text-[10px]">Duration (H)</label>
                    <Input placeholder="2" className="h-11 md:h-12 bg-white rounded-md border-border-primary-50 focus:border-brand-primary transition-all px-md font-bold text-sm" />
                  </div>
                </div>
                <Button className="bg-[#386661] hover:bg-[#386661]/90 text-white rounded-md h-11 md:h-12 w-full sm:w-fit px-xl gap-md font-bold shadow-md transition-all active:scale-[0.98] text-sm">
                  <Zap className="size-4 md:size-5 fill-white" />
                  Launch Flash Sale
                </Button>
              </div>
              <div className="hidden lg:flex items-center justify-center relative h-full min-h-[250px]">
                <div className="size-56 bg-[#386661]/5 rounded-full flex items-center justify-center relative">
                  <Sparkles className="size-20 text-[#386661] opacity-10 animate-pulse" />
                  <div className="absolute top-0 right-0 size-16 bg-brand-primary/10 rounded-full flex items-center justify-center rotate-12">
                    <Tag className="size-7 text-brand-primary opacity-30" />
                  </div>
                  <div className="absolute bottom-4 left-0 size-28 bg-white/50 backdrop-blur-sm rounded-md border border-border-primary-50 flex items-center justify-center -rotate-12 shadow-sm">
                    <Coffee className="size-10 text-[#386661] opacity-40" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <Button 
      variant="ghost" 
      className="justify-between w-full h-11 md:h-12 px-md hover:bg-white text-text-muted hover:text-brand-primary group transition-all rounded-sm border border-transparent hover:border-border-primary-50/20"
    >
      <div className="flex items-center gap-md">
        <Icon className="size-4 md:size-5 group-hover:scale-110 transition-transform" />
        <span className="text-[12px] md:text-body-sm-semibold">{label}</span>
      </div>
      <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </Button>
  );
}

function PromoCard({ image, status, statusColor, title, description, highlight, subHighlight }: { image: string, status: string, statusColor?: string, title: string, description: string, highlight: string, subHighlight: string }) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden flex flex-col group h-full">
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        <Badge className={cn(
          "absolute top-md left-md border-0 rounded-full px-md py-0.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md",
          statusColor || "bg-white/90 text-text-primary"
        )}>
          {status}
        </Badge>
      </div>
      <CardContent className="p-md md:p-lg flex flex-col flex-1 gap-md md:gap-lg">
        <div className="flex flex-col gap-xs md:gap-sm">
          <h3 className="text-body-md-bold md:text-h5-bold text-text-primary leading-tight">{title}</h3>
          <p className="text-[12px] md:text-body-sm-reg text-text-secondary line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
        <Separator className="bg-surface-accent" />
        <div className="flex items-center justify-between mt-auto">
          <span className="text-body-sm-bold md:text-body-md-bold text-brand-primary">{highlight}</span>
          <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-wider">{subHighlight}</span>
        </div>
      </CardContent>
    </Card>
  );
}
