"use client";

import React, { useState } from "react";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MoreVertical, 
  Filter,
  ArrowUpRight,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

const ORDERS_DATA = [
  {
    id: "8821",
    customer: "Marcus Thorne",
    status: "Preparing",
    statusColor: "bg-orange-100 text-orange-700 border-orange-200",
    btnColor: "bg-text-primary hover:bg-text-primary/90",
    btnText: "Mark as Ready",
    items: [
      "1x Single Origin Ethiopia V60",
      "1x Vegan Avocado Toast"
    ],
    note: "Extra olive oil on the toast please",
    bg: "bg-[#eae1d9] border-[#f0660a]/20"
  },
  {
    id: "8819",
    customer: "Elena Rodriguez",
    status: "Ready",
    statusColor: "bg-green-100 text-[#386661] border-green-200",
    btnColor: "bg-[#386661] hover:bg-[#386661]/90",
    btnText: "Assign Delivery",
    items: [
      "3x Cold Brew Concentrate (Retail)"
    ],
    bg: "bg-[#fbf2ea] border-transparent"
  }
];

export default function InternalOrdersPage() {
  const [activeTab, setActiveTab] = useState("ALL ORDERS (12)");

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-sm">
        <span className="text-body-sm-bold text-brand-primary uppercase tracking-widest text-[10px]">Operations Dashboard</span>
        <h1 className="text-body-md-bold md:text-h2-bold text-text-primary">Active Orders</h1>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar pb-xs">
        {["ALL ORDERS (12)", "PENDING (12)", "READY (3)"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-full h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all whitespace-nowrap",
              activeTab === tab 
                ? "bg-text-primary text-white shadow-md" 
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            )}
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-lg">
        {ORDERS_DATA.map((order) => (
          <Card 
            key={order.id} 
            className={cn(
              "border shadow-sm rounded-md overflow-hidden flex flex-col h-full",
              order.bg
            )}
          >
            <CardContent className="p-lg md:p-xl flex flex-col gap-md md:gap-lg h-full">
              <div className="flex items-start justify-between gap-md">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Order #{order.id}</span>
                  <h3 className="text-body-lg-bold md:text-h3-bold text-text-primary">{order.customer}</h3>
                </div>
                <Badge className={cn("rounded-full px-md py-1 border font-bold text-[9px] md:text-[10px] uppercase tracking-wider", order.statusColor)}>
                  {order.status}
                </Badge>
              </div>

              <div className="flex flex-col gap-md flex-1">
                <ul className="flex flex-col gap-sm">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-md text-text-primary">
                      <div className="size-1.5 rounded-full bg-text-primary shrink-0" />
                      <span className="text-body-sm-reg md:text-body-md-reg">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {order.note && (
                  <div className="flex items-start gap-sm bg-white/30 p-sm rounded-sm border border-black/5 italic">
                    <AlertCircle className="size-4 text-brand-primary shrink-0 mt-0.5" />
                    <p className="text-[12px] md:text-[13px] text-[#386661] leading-snug">"{order.note}"</p>
                  </div>
                )}
              </div>

              <Button className={cn("w-full text-white rounded-md h-11 md:h-12 font-bold uppercase tracking-widest text-[11px] md:text-[12px] shadow-sm transition-all active:scale-[0.98]", order.btnColor)}>
                {order.btnText}
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Metric Card */}
        <Card className="bg-[#330f00] border-0 shadow-md rounded-md overflow-hidden relative group md:col-span-2 lg:col-span-1">
          <CardContent className="p-lg md:p-xl flex flex-col justify-between h-full min-h-[160px] md:min-h-[180px]">
            <div className="flex flex-col gap-xs">
              <h4 className="text-h2-bold md:text-display-md text-[#fbf2ea] leading-none">12:04</h4>
              <span className="text-[9px] md:text-[10px] font-bold text-[#fbf2ea]/50 uppercase tracking-[0.2em] mt-sm">Avg. Prep Time Today</span>
            </div>
            <div className="flex items-center gap-md pt-lg border-t border-white/10">
              <div className="flex items-center gap-xs text-success bg-success/10 px-md py-1 rounded-full border border-success/20">
                <ArrowUpRight className="size-3" />
                <span className="text-[11px] md:text-[12px] font-bold">+2m from yesterday</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-lg opacity-10 group-hover:rotate-12 transition-transform duration-500">
              <Clock className="size-16 md:size-24 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
