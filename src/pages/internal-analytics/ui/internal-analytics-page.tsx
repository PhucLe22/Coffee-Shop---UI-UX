"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  ChevronRight,
  Download
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

export default function InternalAnalyticsPage() {
  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-h3-bold text-text-primary">Analytics & Insights</h1>
          <p className="text-body-sm-reg text-text-secondary">Comprehensive performance data for August 2026.</p>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="outline" size="sm" className="h-10 border-border-primary-50 text-text-primary rounded-md gap-xs bg-white">
            <Calendar className="size-4" />
            <span className="hidden sm:inline">Last 30 Days</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 border-border-primary-50 text-text-primary rounded-md gap-xs bg-white">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Metric Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md md:gap-lg">
        <AnalyticsMetricCard title="Gross Sales" value="$42.5K" trend="+8.2%" isUp />
        <AnalyticsMetricCard title="New Members" value="284" trend="+12%" isUp />
        <AnalyticsMetricCard title="Avg. Order" value="$18.50" trend="-1.5%" isUp={false} />
        <AnalyticsMetricCard title="Retention" value="64%" trend="+4%" isUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Main Chart - 2 Columns */}
        <Card className="lg:col-span-2 bg-white border-0 shadow-sm rounded-md overflow-hidden">
          <CardHeader className="p-lg pb-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-body-sm-semibold text-text-muted uppercase tracking-widest text-[10px]">Sales Distribution</CardTitle>
              <h3 className="text-h3-bold text-text-primary mt-xs">Regional Performance</h3>
            </div>
            <div className="size-10 rounded-md bg-surface-accent flex items-center justify-center">
              <BarChart3 className="size-5 text-brand-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-lg">
            <div className="h-[300px] w-full flex items-end justify-between gap-4 pt-xl px-md">
              {[60, 85, 45, 100, 75, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-md group">
                  <div className="w-full bg-surface-muted rounded-t-sm relative transition-all group-hover:bg-brand-primary/20" style={{ height: `${h}%` }}>
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-brand-primary rounded-t-sm transition-all duration-700" 
                      style={{ height: `${h * 0.7}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase">Loc {i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Retention Pie - 1 Column */}
        <Card className="bg-text-primary border-0 shadow-md rounded-md overflow-hidden text-surface-accent flex flex-col">
          <CardHeader className="p-lg pb-0">
            <CardTitle className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-center">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent className="p-xl flex-1 flex flex-col items-center justify-center gap-xl text-center">
            <div className="size-48 rounded-full border-[12px] border-surface-accent/10 relative flex items-center justify-center">
              {/* Mock Semicircle/Pie via clip-path or absolute elements */}
              <div className="absolute inset-0 rounded-full border-[12px] border-brand-primary" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
              <div className="flex flex-col">
                <span className="text-display-md leading-none">64%</span>
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-sm">Loyal Members</span>
              </div>
            </div>
            <div className="flex flex-col gap-sm">
              <p className="text-body-sm-reg opacity-80 leading-relaxed max-w-[200px]">
                Strong growth in member retention following the **Monday Roast** campaign launch.
              </p>
              <Button variant="ghost" className="text-white hover:bg-white/10 mx-auto w-fit h-8 text-[12px] font-bold">
                Detailed Breakdown <ChevronRight className="size-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Card className="bg-text-secondary border-0 shadow-sm rounded-md p-lg flex items-center gap-lg text-white group">
          <div className="size-14 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp className="size-7 text-white" />
          </div>
          <div className="flex flex-col gap-xs">
            <h4 className="text-body-md-bold">Market Opportunity</h4>
            <p className="text-[12px] opacity-80 leading-snug">Vegan bakery items are trending up in **East End**. Increase weekend production by 20%.</p>
          </div>
        </Card>
        <Card className="bg-surface-accent border border-border-primary-50/20 shadow-sm rounded-md p-lg flex items-center gap-lg group">
          <div className="size-14 rounded-md bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-border-primary-50/10 group-hover:scale-110 transition-transform">
            <Activity className="size-7 text-brand-primary" />
          </div>
          <div className="flex flex-col gap-xs">
            <h4 className="text-body-md-bold text-text-primary">Engagement Spike</h4>
            <p className="text-[12px] text-text-secondary leading-snug">App engagement peaked during morning hours. Push notification delivery was 98% successful.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsMetricCard({ title, value, trend, isUp }: { title: string, value: string, trend: string, isUp: boolean }) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-md p-lg flex flex-col gap-xs hover:shadow-md transition-shadow">
      <span className="text-body-sm-semibold text-text-muted uppercase tracking-wider text-[10px]">{title}</span>
      <h4 className="text-h3-bold text-text-primary leading-none">{value}</h4>
      <div className={cn(
        "flex items-center gap-xs text-[12px] font-bold mt-sm",
        isUp ? "text-success" : "text-error"
      )}>
        {isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
        {trend}
      </div>
    </Card>
  );
}
