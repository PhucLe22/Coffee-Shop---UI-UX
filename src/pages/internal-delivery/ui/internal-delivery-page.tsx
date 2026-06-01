"use client";

import React from "react";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  Navigation, 
  Zap,
  ArrowRight,
  MoreVertical,
  Calendar
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

const ACTIVE_ORDERS = [
  {
    id: "COL-8291",
    customer: "Marcus Thorne",
    address: "742 Evergreen Terrace, Springfield",
    items: "2x Nitro Cold Brew, 1x Almond Croissant",
    status: "DELIVERING",
    statusColor: "bg-blue-100 text-blue-700",
    isActive: true
  },
  {
    id: "COL-8302",
    customer: "Elena Rodriguez",
    address: "123 Maple Street, Riverside",
    items: "1x Velvet Espresso, 2x Oat Flat White",
    status: "PENDING",
    statusColor: "bg-surface-muted text-text-muted",
    isActive: false
  },
  {
    id: "COL-8315",
    customer: "Julian Vance",
    address: "456 Oak Lane, Downtown",
    items: "3x Cold Brew Reserve",
    status: "PENDING",
    statusColor: "bg-surface-muted text-text-muted",
    isActive: false
  }
];

export default function DeliveryPage() {
  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-sm">
        <span className="text-body-sm-bold text-brand-primary uppercase tracking-widest text-[10px]">Active Shifts</span>
        <h1 className="text-body-md-bold md:text-h2-bold text-text-primary">Delivery Queue</h1>
        <p className="text-[12px] md:text-body-md-reg text-text-secondary">Currently navigating 3 artisanal deliveries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {/* Main Queue - Left 2 Columns */}
        <div className="lg:col-span-2 flex flex-col gap-md md:gap-lg">
          {ACTIVE_ORDERS.map((order) => (
            <Card 
              key={order.id} 
              className={cn(
                "bg-white border-0 shadow-sm rounded-md overflow-hidden transition-all duration-300",
                order.isActive && "border-2 border-brand-primary/50 shadow-md ring-4 ring-brand-primary/5"
              )}
            >
              <CardContent className="p-md md:p-lg flex flex-col gap-md md:gap-lg">
                <div className="flex items-start justify-between gap-md">
                  <div className="flex flex-col gap-xs">
                    <h3 className="text-body-lg-bold md:text-h3-bold text-text-primary leading-none">{order.customer}</h3>
                    <span className="text-[12px] md:text-body-sm-reg text-text-muted">Order #{order.id}</span>
                  </div>
                  <Badge className={cn("rounded-full px-md py-1 border-0 font-bold text-[9px] md:text-[10px] uppercase tracking-wider", order.statusColor)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="flex flex-col gap-sm md:gap-md">
                  <div className="flex items-center gap-md text-text-primary">
                    <div className="size-8 rounded-full bg-surface-accent flex items-center justify-center flex-shrink-0">
                      <MapPin className="size-3.5 md:size-4 text-brand-primary" />
                    </div>
                    <span className="text-[13px] md:text-body-md-reg leading-snug">{order.address}</span>
                  </div>
                  <div className="flex items-center gap-md text-text-primary">
                    <div className="size-8 rounded-full bg-surface-accent flex items-center justify-center flex-shrink-0">
                      <Package className="size-3.5 md:size-4 text-brand-primary" />
                    </div>
                    <span className="text-[13px] md:text-body-md-reg leading-snug">{order.items}</span>
                  </div>
                </div>

                {order.isActive ? (
                  <Button className="w-full bg-brand-primary hover:bg-brand-accent text-white rounded-md h-11 md:h-12 gap-md font-bold text-sm md:text-md shadow-md transition-all active:scale-[0.98]">
                    <CheckCircle2 className="size-4 md:size-5" />
                    Confirm Delivery
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full border-border-primary-50 text-text-primary rounded-md h-11 md:h-12 font-bold text-sm hover:bg-surface-accent transition-all">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Side Panel - Right 1 Column */}
        <div className="lg:col-span-1 flex flex-col gap-md md:gap-lg">
          {/* Map Focus */}
          <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden relative min-h-[300px] md:min-h-[400px]">
            {/* Mock Map Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=1000&fit=crop" 
                alt="Route Map" 
                className="w-full h-full object-cover grayscale contrast-75 opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            
            {/* Interactive Overlay */}
            <CardContent className="p-md md:p-lg relative z-10 h-full flex flex-col justify-end">
              <div className="bg-white/90 backdrop-blur-md border border-border-primary-50 rounded-md p-md md:p-lg shadow-lg flex items-center justify-between gap-md">
                <div className="flex items-center gap-sm md:gap-md">
                  <div className="size-8 md:size-10 rounded-md bg-brand-primary flex items-center justify-center shadow-md shrink-0">
                    <Navigation className="size-4 md:size-5 text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] md:text-[10px] font-bold text-brand-primary uppercase tracking-widest truncate">Next Destination</span>
                    <span className="text-[12px] md:text-body-md-bold text-text-primary leading-tight truncate">742 Evergreen Terrace</span>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest">ETA</span>
                  <span className="text-body-md-bold md:text-h3-bold text-text-primary leading-none">8 Mins</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shift Stats */}
          <div className="grid grid-cols-2 gap-md">
            <Card className="bg-[#faf2eb] border border-border-primary-50/50 shadow-sm rounded-md p-md md:p-lg flex flex-col gap-xs">
              <span className="text-[9px] md:text-[10px] font-bold text-[#386661] uppercase tracking-widest">Delivered</span>
              <span className="text-h3-bold md:text-h2-bold text-text-primary">14</span>
            </Card>
            <Card className="bg-[#faf2eb] border border-border-primary-50/50 shadow-sm rounded-md p-md md:p-lg flex flex-col gap-xs">
              <span className="text-[9px] md:text-[10px] font-bold text-[#386661] uppercase tracking-widest">Tips</span>
              <span className="text-h3-bold md:text-h2-bold text-text-primary">$142</span>
            </Card>
          </div>

          {/* Efficiency CTA */}
          <Card className="bg-[#386661] border-0 shadow-md rounded-md overflow-hidden p-md md:p-lg flex flex-col gap-md text-inverse-text">
            <div className="flex flex-col gap-xs">
              <h4 className="text-body-sm-bold md:text-body-md-bold">Optimization Goal</h4>
              <p className="text-[11px] md:text-[12px] opacity-80 leading-snug">You're currently **12% ahead** of your average delivery time.</p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full shadow-[0_0_8px_rgba(240,102,10,0.5)]" style={{ width: "88%" }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
