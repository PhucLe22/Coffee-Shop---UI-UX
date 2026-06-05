"use client";

import React from "react";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Package, 
  Navigation, 
  ChevronRight,
  Map as MapIcon,
  Timer,
  DollarSign
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";

// Mock data for delivery orders based on Figma
const ACTIVE_ORDERS = [
  {
    id: "COL-8291",
    customer: "Marcus Thorne",
    status: "ĐANG GIAO",
    address: "742 Evergreen Terrace, Springfield",
    items: "2x Nitro Cold Brew, 1x Almond Croissant",
    location: { lng: 106.6948, lat: 10.7719 },
    isFocused: true,
  },
  {
    id: "COL-8292",
    customer: "Marcus Thorne",
    status: "ĐANG GIAO",
    address: "742 Evergreen Terrace, Springfield",
    items: "1x Flat White, 2x Pain au Chocolat",
    location: { lng: 106.7018, lat: 10.7760 },
    isFocused: false,
  },
  {
    id: "COL-8293",
    customer: "Marcus Thorne",
    status: "ĐANG GIAO",
    address: "742 Evergreen Terrace, Springfield",
    items: "3x Espresso, 1x Blueberry Muffin",
    location: { lng: 106.6980, lat: 10.7740 },
    isFocused: false,
  }
];

export function InternalDeliveryPage() {
  return (
    <div className="flex flex-col h-full bg-surface-main overflow-y-auto no-scrollbar">
      {/* Page Header */}
      <div className="p-md lg:p-xl space-y-xs lg:space-y-sm">
        <p className="text-brand-primary text-body-sm-semibold uppercase tracking-[0.2em]">Active Shifts</p>
        <h1 className="text-h1-bold text-text-primary leading-none">Delivery Queue</h1>
        <p className="text-text-secondary text-body-md-reg">Currently navigating 3 artisanal deliveries.</p>
      </div>

      {/* Bento Grid Layout */}
      <div className="px-md lg:px-xl pb-xl grid grid-cols-1 lg:grid-cols-12 gap-md lg:gap-lg">
        
        {/* Left Column: Map & Stats (Desktop: 4 cols) */}
        <div className="lg:col-span-4 space-y-md lg:space-y-lg flex flex-col">
          
          {/* Map Snippet */}
          <Card className="rounded-[24px] border-none shadow-sm overflow-hidden flex-1 min-h-[300px] lg:min-h-0 relative group">
            <Map 
              center={ACTIVE_ORDERS[0].location} 
              zoom={15} 
              className="w-full h-full grayscale-[0.3] contrast-[1.1]"
            >
              <MapMarker longitude={ACTIVE_ORDERS[0].location.lng} latitude={ACTIVE_ORDERS[0].location.lat}>
                <MarkerContent>
                  <div className="size-6 rounded-full bg-brand-primary border-4 border-white shadow-lg animate-pulse" />
                </MarkerContent>
              </MapMarker>
            </Map>
            
            {/* Interactive Map Overlay */}
            <div className="absolute bottom-md left-md right-md bg-surface-main/95 border border-text-muted/20 rounded-[16px] p-md flex items-center justify-between backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-md">
                <div className="size-10 rounded-[12px] bg-brand-primary flex items-center justify-center shadow-md">
                  <MapPin className="text-white size-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Next Destination</p>
                  <p className="text-text-primary text-body-sm-semibold leading-tight">742 Evergreen<br/>Terrace</p>
                </div>
              </div>
              <div className="text-right border-l border-text-muted/20 pl-md">
                <p className="text-brand-primary text-[10px] font-extrabold uppercase tracking-widest leading-none mb-1">ETA</p>
                <p className="text-text-primary text-h4-bold leading-none">8<span className="text-xs ml-0.5 uppercase tracking-normal">Mins</span></p>
              </div>
            </div>
          </Card>

          {/* Shift Stats (Asymmetric) */}
          <div className="grid grid-cols-2 gap-md lg:gap-lg">
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Delivered Today</p>
              <h3 className="text-h2-bold text-text-primary mt-md">14</h3>
            </Card>
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Total Tips</p>
                <DollarSign className="size-4 text-brand-primary opacity-50" />
              </div>
              <h3 className="text-h2-bold text-text-primary mt-md">$142.50</h3>
            </Card>
          </div>
        </div>

        {/* Right Column: Active Order List (Desktop: 8 cols) */}
        <div className="lg:col-span-8 space-y-md lg:space-y-lg">
          <div className="flex items-center justify-between px-xs">
            <h2 className="text-h4-bold text-text-primary">Active Shipments</h2>
            <Badge variant="outline" className="rounded-full border-text-muted/20 text-text-secondary text-[10px] font-bold px-3">3 ORDERS</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-md lg:gap-lg">
            {ACTIVE_ORDERS.map((order, idx) => (
              <Card 
                key={idx} 
                className={cn(
                  "rounded-[24px] border-none shadow-sm transition-all duration-300 overflow-hidden group hover:shadow-md",
                  order.isFocused ? "bg-surface-accent ring-1 ring-brand-primary/30" : "bg-surface-accent/60"
                )}
              >
                <CardContent className="p-lg lg:p-xl space-y-lg">
                  {/* Card Top: Customer & Status */}
                  <div className="flex items-start justify-between gap-md">
                    <div className="space-y-0.5">
                      <h3 className="text-h3-bold text-text-primary group-hover:text-brand-primary transition-colors">{order.customer}</h3>
                      <p className="text-text-secondary text-body-sm-reg">Order #{order.id}</p>
                    </div>
                    <Badge className="bg-info text-white hover:bg-info/90 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full shrink-0">
                      {order.status}
                    </Badge>
                  </div>

                  {/* Card Middle: Address & Items */}
                  <div className="space-y-md">
                    <div className="flex items-start gap-sm">
                      <MapPin className="size-5 text-brand-primary shrink-0 mt-0.5" />
                      <p className="text-text-secondary text-body-sm-reg leading-snug">{order.address}</p>
                    </div>
                    <div className="flex items-start gap-sm">
                      <Package className="size-5 text-text-muted shrink-0 mt-0.5" />
                      <p className="text-text-secondary text-body-sm-reg leading-snug">{order.items}</p>
                    </div>
                  </div>

                  {/* Card Bottom: Action Button (Visible on focus or hover) */}
                  <div className="pt-md border-t border-text-muted/10 flex items-center justify-between gap-lg">
                    {order.isFocused ? (
                      <Button className="w-full h-14 rounded-full bg-brand-primary hover:bg-brand-accent text-white gap-md label-button-md shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
                        <CheckCircle2 className="size-6" /> Confirm Delivery
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center gap-xs text-text-muted group-hover:text-text-secondary transition-colors">
                          <Timer className="size-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Awaiting drop-off</span>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                          <ChevronRight className="size-6" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Support / Support Button */}
          <Button variant="ghost" className="w-full h-14 rounded-[24px] border-2 border-dashed border-text-muted/20 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all gap-md label-button-md">
            <Timer className="size-5" /> Need Assistance? Contact Dispatch
          </Button>
        </div>
      </div>
    </div>
  );
}
