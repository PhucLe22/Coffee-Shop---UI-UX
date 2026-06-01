"use client";

import React from "react";
import { 
  Search, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Activity,
  ChevronRight,
  MoreVertical,
  Coffee,
  CheckCircle2,
  Users
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

export default function DashboardPage() {
  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-md top-1/2 -translate-y-1/2 size-5 text-text-muted" />
          <Input 
            placeholder="Search analytics, logs..." 
            className="pl-xl h-12 bg-white/50 border-border-primary-50 rounded-md focus:bg-white transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-sm bg-surface-muted/50 p-sm rounded-md border border-border-primary-50">
          <Calendar className="size-4 md:size-5 text-text-secondary" />
          <span className="text-[12px] md:text-body-sm-semibold text-text-primary">Aug 1, 2026 - Aug 31, 2026</span>
          <Separator orientation="vertical" className="h-4 mx-xs hidden sm:block" />
          <Button variant="ghost" size="sm" className="text-brand-primary h-7 md:h-8 px-sm hover:bg-white rounded-sm text-[12px]">
            Change
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm md:gap-md">
        <StatCard 
          title="Revenue" 
          value="$154K" 
          trend="+12.5%" 
          trendType="up" 
        />
        <StatCard 
          title="Branches" 
          value="14" 
          trend="Stable" 
          trendType="neutral" 
        />
        <StatCard 
          title="Invoices" 
          value="28" 
          trend="-5.2%" 
          trendType="down" 
        />
        <StatCard 
          title="Customers" 
          value="1.4K" 
          trend="+8.4%" 
          trendType="up" 
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {/* Revenue Flow */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-sm rounded-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-md md:p-lg pb-0">
            <div className="flex flex-col gap-xs">
              <CardTitle className="text-[10px] md:text-h5-bold text-text-primary uppercase tracking-wider opacity-60">Revenue Insights</CardTitle>
              <h2 className="text-body-md-bold md:text-h3-bold text-text-primary">Monthly Revenue Flow</h2>
            </div>
            <div className="flex items-center bg-surface-muted/50 p-1 rounded-full border border-border-primary-50 scale-90 md:scale-100">
              <Button variant="ghost" size="sm" className="rounded-full h-7 md:h-8 px-md text-text-primary text-[12px]">Week</Button>
              <Button variant="ghost" size="sm" className="rounded-full h-7 md:h-8 px-md bg-white text-brand-primary shadow-sm text-[12px]">Month</Button>
            </div>
          </CardHeader>
          <CardContent className="p-md md:p-lg">
            <div className="h-[180px] md:h-[232px] w-full mt-md">
              <MockRevenueChart />
            </div>
            <div className="flex justify-between mt-md px-md">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="text-[8px] md:text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-60">{day}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Roasts */}
        <Card className="bg-surface-accent border-0 shadow-sm rounded-md">
          <CardHeader className="p-md md:p-lg pb-md">
            <CardTitle className="text-body-md-bold md:text-h3-bold text-text-primary">Popular Roasts</CardTitle>
          </CardHeader>
          <CardContent className="p-md md:p-lg pt-0 flex flex-col gap-md md:gap-lg">
            <PopularRoastItem 
              image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop"
              name="Velvet Espresso"
              percentage={88}
            />
            <PopularRoastItem 
              image="https://images.unsplash.com/photo-1541167760496-1628856ab752?w=100&h=100&fit=crop"
              name="Oat Flat White"
              percentage={72}
            />
            <PopularRoastItem 
              image="https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=100&h=100&fit=crop"
              name="Cold Brew Reserve"
              percentage={64}
            />
            <Button variant="outline" className="mt-md border-text-primary/20 text-text-primary uppercase tracking-widest text-[10px] font-bold h-10 hover:bg-white rounded-md">
              View Full Inventory
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {/* Geo Performance */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-sm rounded-md overflow-hidden flex flex-col md:flex-row">
          <div className="flex-1 p-md md:p-lg flex flex-col gap-md md:gap-lg border-b md:border-b-0 md:border-r border-border-primary-50/10">
            <div>
              <h2 className="text-body-md-bold md:text-h3-bold text-text-primary">Geo-Performance</h2>
              <p className="text-[12px] md:text-body-sm-reg text-text-secondary mt-xs">Regional branch revenue distribution</p>
            </div>
            <div className="flex flex-col gap-sm md:gap-md">
              <GeoLocationItem name="Downtown Core" value="$4,200" />
              <GeoLocationItem name="West End Artisan" value="$3,150" />
              <GeoLocationItem name="Riverside Roastery" value="$2,890" />
            </div>
          </div>
          <div className="flex-1 bg-surface-muted/30 relative min-h-[200px] md:min-h-[250px]">
            <MockMap />
          </div>
        </Card>

        {/* Staff Narrative */}
        <Card className="bg-surface-muted border-0 shadow-sm rounded-md overflow-hidden">
          <CardHeader className="p-md md:p-lg pb-md">
            <CardTitle className="text-body-md-bold md:text-h3-bold text-text-primary">Staff Narrative</CardTitle>
          </CardHeader>
          <CardContent className="p-md md:p-lg pt-0 flex flex-col gap-md md:gap-lg">
            <NarrativeItem 
              icon={CheckCircle2} 
              iconBg="bg-[#b9e9e1]" 
              text="Marcus Thorne restocked Ethiopian Yirgacheffe at Downtown Core." 
              time="14 minutes ago" 
              bold 
            />
            <NarrativeItem 
              icon={Activity} 
              iconBg="bg-[#551e00]" 
              iconColor="text-white"
              text="Riverside Roastery reported a peak in morning rush traffic." 
              time="1 hour ago" 
              bold 
            />
            <NarrativeItem 
              icon={Users} 
              iconBg="bg-surface-muted border border-border-primary-50" 
              text="Monthly safety audit completed for West End Artisan." 
              time="3 hours ago" 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendType }: { title: string, value: string, trend: string, trendType: 'up' | 'down' | 'neutral' }) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-md hover:shadow-md transition-shadow">
      <CardContent className="p-md flex flex-col gap-xs">
        <p className="text-[10px] md:text-body-sm-semibold text-text-muted uppercase tracking-wider">{title}</p>
        <h3 className="text-h3-bold md:text-h2-bold text-text-primary">{value}</h3>
        <div className="flex items-center gap-xs">
          {trendType === 'up' && <TrendingUp className="size-3 md:size-4 text-success" />}
          {trendType === 'down' && <TrendingDown className="size-3 md:size-4 text-error" />}
          {trendType === 'neutral' && <Minus className="size-3 md:size-4 text-text-muted" />}
          <span className={cn(
            "text-[10px] md:text-[12px] font-bold",
            trendType === 'up' ? "text-success" : trendType === 'down' ? "text-error" : "text-text-muted"
          )}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function MockRevenueChart() {
  // Creating a visual mock of the line chart as seen in Figma
  const points = [40, 80, 60, 100, 70, 120, 90];
  return (
    <div className="flex items-end justify-between h-full w-full gap-2 md:gap-4 relative">
      {points.map((height, i) => (
        <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
          <div 
            className="w-full bg-gradient-to-t from-brand-primary/10 to-brand-primary/5 rounded-t-sm relative" 
            style={{ height: `${height}%` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 md:size-2 bg-brand-primary rounded-full shadow-[0_0_8px_rgba(240,102,10,0.5)] z-10" />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-px bg-text-primary" />
        ))}
      </div>
    </div>
  );
}

function PopularRoastItem({ image, name, percentage }: { image: string, name: string, percentage: number }) {
  return (
    <div className="flex items-center gap-md">
      <div className="size-10 md:size-12 rounded-sm bg-white overflow-hidden flex-shrink-0 border border-border-primary-50/20">
        <img src={image} alt={name} className="size-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <span className="text-[12px] md:text-body-sm-semibold text-text-primary">{name}</span>
          <span className="text-[12px] md:text-body-sm-semibold text-text-secondary">{percentage}%</span>
        </div>
        <div className="w-full h-1 md:h-1.5 bg-surface-muted rounded-full overflow-hidden">
          <div className="h-full bg-brand-primary rounded-full" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
}

function GeoLocationItem({ name, value }: { name: string, value: string }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-surface-main/50 p-xs -mx-xs rounded-sm transition-colors">
      <span className="text-body-sm-reg md:text-body-md-reg text-text-primary group-hover:text-brand-primary transition-colors">{name}</span>
      <span className="text-body-sm-bold md:text-body-md-bold text-[#1f1b16]">{value}</span>
    </div>
  );
}

function MockMap() {
  return (
    <div className="absolute inset-0 bg-[#eae1d9] flex items-center justify-center grayscale contrast-75 opacity-50">
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,20 Q30,10 50,40 T100,30" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M0,50 Q40,60 60,30 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
        <path d="M20,0 Q10,40 40,60 T30,100" fill="none" stroke="white" strokeWidth="0.5" />
      </svg>
      <div className="absolute top-1/4 left-1/3 size-2 md:size-3 bg-brand-primary rounded-full shadow-lg pulse animate-pulse" />
      <div className="absolute top-1/2 left-2/3 size-2 md:size-3 bg-brand-primary rounded-full shadow-lg" />
      <div className="absolute top-3/4 left-1/4 size-2 md:size-3 bg-brand-primary rounded-full shadow-lg" />
    </div>
  );
}

function NarrativeItem({ icon: Icon, iconBg, iconColor, text, time, bold }: { icon: any, iconBg: string, iconColor?: string, text: string, time: string, bold?: boolean }) {
  return (
    <div className="flex items-start gap-md">
      <div className={cn("size-8 md:size-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", iconBg)}>
        <Icon className={cn("size-4 md:size-5", iconColor || "text-text-primary")} />
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className={cn(
          "text-[12px] md:text-body-sm-reg text-text-primary leading-tight",
          bold && "font-bold"
        )}>
          {text}
        </p>
        <span className="text-[9px] md:text-[10px] text-text-muted font-medium">{time}</span>
      </div>
    </div>
  );
}
