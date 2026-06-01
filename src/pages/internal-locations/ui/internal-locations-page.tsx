"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Store, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Users,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";

const LOCATIONS_DATA = [
  {
    id: 1,
    name: "Downtown Reserve",
    address: "742 Evergreen Terrace, Springfield",
    manager: "Marcus Thorne",
    managerImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    status: "Operational",
    statusColor: "bg-green-100 text-[#386661]",
    capacity: "85%",
    performance: "+12%"
  },
  {
    id: 2,
    name: "East End Roastery",
    address: "123 Maple Street, Riverside",
    manager: "Elena Rodriguez",
    managerImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    status: "Operational",
    statusColor: "bg-green-100 text-[#386661]",
    capacity: "42%",
    performance: "+5%"
  },
  {
    id: 3,
    name: "The Hub (Central)",
    address: "456 Oak Lane, Downtown",
    manager: "Julian Vance",
    managerImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    status: "Maintenance",
    statusColor: "bg-orange-100 text-orange-700",
    capacity: "0%",
    performance: "N/A"
  }
];

export default function InternalLocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-h3-bold text-text-primary">Store Locations</h1>
          <p className="text-body-sm-reg text-text-secondary">Manage your regional collective branches.</p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative w-full max-w-xs hidden md:block">
            <Search className="absolute left-md top-1/2 -translate-y-1/2 size-4 text-text-muted" />
            <Input 
              placeholder="Search locations..." 
              className="pl-xl h-10 bg-white/50 border-border-primary-50 rounded-md focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-brand-primary hover:bg-brand-accent text-white rounded-md h-10 gap-xs shadow-sm whitespace-nowrap">
            <Plus className="size-4" />
            <span className="label-button-md text-sm">Add New Store</span>
          </Button>
        </div>
      </div>

      {/* Grid: Map + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        {/* Desktop Table / Mobile List - 3 Columns */}
        <div className="lg:col-span-3 flex flex-col gap-lg">
          <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-accent/30 text-left border-b border-border-primary-50/10">
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Branch Name</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Manager</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Status</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Capacity</th>
                    <th className="p-lg text-right text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {LOCATIONS_DATA.map((loc) => (
                    <tr key={loc.id} className="border-b border-border-primary-50/5 hover:bg-surface-main/30 transition-colors group">
                      <td className="p-lg">
                        <div className="flex flex-col gap-xs">
                          <span className="text-body-md-bold text-text-primary">{loc.name}</span>
                          <span className="text-[12px] text-text-muted flex items-center gap-1">
                            <MapPin className="size-3" /> {loc.address}
                          </span>
                        </div>
                      </td>
                      <td className="p-lg">
                        <div className="flex items-center gap-sm">
                          <Avatar className="size-8 border border-border-primary-50/20">
                            <AvatarImage src={loc.managerImg} alt={loc.manager} />
                            <AvatarFallback>{loc.manager.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-body-sm-semibold text-text-primary">{loc.manager}</span>
                        </div>
                      </td>
                      <td className="p-lg">
                        <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[10px] uppercase tracking-wide", loc.statusColor)}>
                          {loc.status}
                        </Badge>
                      </td>
                      <td className="p-lg">
                        <div className="flex flex-col gap-xs w-24">
                          <div className="flex items-center justify-between text-[10px] font-bold text-text-secondary">
                            <span>{loc.capacity}</span>
                            <span className="text-success">{loc.performance}</span>
                          </div>
                          <div className="h-1.5 w-full bg-surface-muted rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary rounded-full" style={{ width: loc.capacity }} />
                          </div>
                        </div>
                      </td>
                      <td className="p-lg text-right">
                        <Button variant="ghost" size="icon" className="size-8 text-text-muted hover:text-brand-primary rounded-md">
                          <ExternalLink className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col">
              {LOCATIONS_DATA.map((loc) => (
                <div key={loc.id} className="p-lg border-b border-border-primary-50/10 flex flex-col gap-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-xs">
                      <h3 className="text-body-md-bold text-text-primary">{loc.name}</h3>
                      <p className="text-[12px] text-text-muted leading-snug max-w-[200px]">{loc.address}</p>
                    </div>
                    <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[9px] uppercase tracking-wide", loc.statusColor)}>
                      {loc.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-xs">
                    <div className="flex items-center gap-md">
                      <Avatar className="size-8 border border-border-primary-50/20">
                        <AvatarImage src={loc.managerImg} alt={loc.manager} />
                        <AvatarFallback>{loc.manager.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-text-primary">{loc.manager}</span>
                        <span className="text-[10px] text-text-muted">Branch Manager</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-9 px-md border-border-primary-50 text-text-primary rounded-md gap-xs">
                      Manage <ChevronRight className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side Panel: System Stats - 1 Column */}
        <div className="lg:col-span-1 flex flex-col gap-lg">
          <Card className="bg-[#330f00] border-0 shadow-md rounded-md overflow-hidden relative group">
            <CardContent className="p-xl flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <span className="text-[10px] font-bold text-[#fbf2ea]/50 uppercase tracking-[0.2em]">Operational Health</span>
                <h4 className="text-display-md text-[#fbf2ea] leading-none">98.4%</h4>
              </div>
              <p className="text-[12px] text-[#fbf2ea]/80 leading-relaxed">
                All regions are reporting optimal server and POS performance. No active critical maintenance alerts.
              </p>
              <Button className="bg-brand-primary hover:bg-brand-accent text-white rounded-md h-11 w-full font-bold shadow-sm transition-transform active:scale-95">
                Run Diagnostics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-surface-accent border border-border-primary-50/20 shadow-sm rounded-md p-lg flex flex-col gap-md">
            <div className="flex items-center gap-md">
              <div className="size-10 rounded-md bg-white flex items-center justify-center shadow-sm border border-border-primary-50/10">
                <Users className="size-5 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Staffing</span>
                <span className="text-body-md-bold text-text-primary">148 Employees</span>
              </div>
            </div>
            <Separator className="bg-text-primary/5" />
            <div className="flex items-center gap-md">
              <div className="size-10 rounded-md bg-white flex items-center justify-center shadow-sm border border-border-primary-50/10">
                <Store className="size-5 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Footprint</span>
                <span className="text-body-md-bold text-text-primary">12 Locations</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
