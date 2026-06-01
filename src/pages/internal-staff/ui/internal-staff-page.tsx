"use client";

import React, { useState } from "react";
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  MapPin, 
  Clock, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Award,
  Zap
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";

const STAFF_DATA = [
  {
    id: 1,
    name: "Elena Rodriguez",
    email: "elena.r@collective.com",
    role: "Head Barista",
    roleColor: "bg-blue-100 text-blue-700",
    location: "Downtown Reserve",
    status: "Clocked In",
    statusColor: "bg-success",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "m.chen@collective.com",
    role: "Store Manager",
    roleColor: "bg-orange-100 text-orange-700",
    location: "East End Roastery",
    status: "Off Duty",
    statusColor: "bg-text-muted/30",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Julian Vance",
    email: "j.vance@collective.com",
    role: "Lead Roaster",
    roleColor: "bg-blue-100 text-blue-700",
    location: "The Hub (Central)",
    status: "Clocked In",
    statusColor: "bg-success",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Sonia Gupta",
    email: "s.gupta@collective.com",
    role: "Barista",
    roleColor: "bg-orange-100 text-orange-700",
    location: "Parkway Garden",
    status: "Clocked In",
    statusColor: "bg-success",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("All Employees");

  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-body-md-bold md:text-h3-bold text-text-primary">Staff Management</h1>
          <p className="text-[12px] md:text-body-sm-reg text-text-secondary">Oversee your team across all locations</p>
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
            <UserPlus className="size-4" />
            <span className="hidden sm:inline label-button-md text-sm">Add Staff</span>
          </Button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div className="flex items-center bg-surface-muted/30 p-1 rounded-md border border-border-primary-50 w-full md:w-fit overflow-x-auto no-scrollbar">
          {["All Employees", "Baristas", "Managers", "Roasters"].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-sm h-8 px-md text-[12px] md:text-body-sm-semibold transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-white text-brand-primary shadow-sm" 
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {tab}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-xs border-border-primary-50 text-text-primary rounded-md hidden md:flex">
          <Filter className="size-4" />
          More Filters
        </Button>
      </div>

      {/* Staff List/Table */}
      <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-accent/30 text-left border-b border-border-primary-50/10">
                <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Employee</th>
                <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Role</th>
                <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Location</th>
                <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Shift Status</th>
                <th className="p-lg text-right text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {STAFF_DATA.map((staff) => (
                <tr key={staff.id} className="border-b border-border-primary-50/5 hover:bg-surface-main/30 transition-colors group">
                  <td className="p-lg">
                    <div className="flex items-center gap-md">
                      <Avatar className="size-10 border border-border-primary-50/20 shadow-sm">
                        <AvatarImage src={staff.image} alt={staff.name} />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-body-md-bold text-text-primary">{staff.name}</span>
                        <span className="text-body-sm-reg text-text-muted">{staff.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-lg">
                    <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[10px] uppercase tracking-wide", staff.roleColor)}>
                      {staff.role}
                    </Badge>
                  </td>
                  <td className="p-lg">
                    <div className="flex items-center gap-xs text-text-primary">
                      <MapPin className="size-3 text-brand-primary" />
                      <span className="text-body-sm-semibold">{staff.location}</span>
                    </div>
                  </td>
                  <td className="p-lg">
                    <div className="flex items-center gap-sm">
                      <div className={cn("size-2 rounded-full", staff.statusColor)} />
                      <span className="text-body-sm-reg text-text-secondary">{staff.status}</span>
                    </div>
                  </td>
                  <td className="p-lg text-right">
                    <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8 text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-md">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-text-muted hover:text-error hover:bg-error/5 rounded-md">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col">
          {STAFF_DATA.map((staff) => (
            <div key={staff.id} className="p-md border-b border-border-primary-50/10 flex flex-col gap-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-md">
                  <Avatar className="size-10 border border-border-primary-50/20 shadow-sm">
                    <AvatarImage src={staff.image} alt={staff.name} />
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-body-sm-bold text-text-primary">{staff.name}</span>
                    <span className="text-[11px] text-text-muted truncate max-w-[150px]">{staff.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8 text-text-muted rounded-md">
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 text-text-muted rounded-md">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-sm">
                <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[9px] uppercase tracking-wide", staff.roleColor)}>
                  {staff.role}
                </Badge>
                <div className="flex items-center gap-sm">
                  <div className={cn("size-2 rounded-full", staff.statusColor)} />
                  <span className="text-[11px] text-text-secondary">{staff.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-xs text-text-primary">
                <MapPin className="size-3 text-brand-primary" />
                <span className="text-[11px] font-semibold">{staff.location}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="p-md md:p-lg bg-surface-accent/10 flex flex-col sm:flex-row items-center justify-between gap-md border-t border-border-primary-50/10">
          <p className="text-[12px] md:text-body-sm-semibold text-text-secondary order-2 sm:order-1">Showing 1-4 of 148 Employees</p>
          <div className="flex items-center gap-xs order-1 sm:order-2">
            <Button variant="outline" size="icon" className="size-8 md:size-9 border-border-primary-50 rounded-md" disabled>
              <ChevronLeft className="size-4" />
            </Button>
            <Button className="size-8 md:size-9 bg-text-primary text-white rounded-md font-bold text-[12px]">1</Button>
            <Button variant="ghost" className="size-8 md:size-9 text-text-secondary rounded-md font-medium text-[12px]">2</Button>
            <Button variant="ghost" className="size-8 md:size-9 text-text-secondary rounded-md font-medium text-[12px]">3</Button>
            <Button variant="outline" size="icon" className="size-8 md:size-9 border-border-primary-50 rounded-md">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md md:gap-lg">
        {/* Rewards Program */}
        <Card className="lg:col-span-2 bg-[#386661] border-0 shadow-md rounded-md overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 Q50,50 100,0 T200,0" fill="white" />
              <circle cx="80" cy="20" r="10" fill="white" />
              <circle cx="60" cy="70" r="5" fill="white" />
            </svg>
          </div>
          <CardContent className="p-lg md:p-xl relative z-10 flex flex-col gap-md md:gap-lg max-w-xl">
            <h2 className="text-body-lg-bold md:text-h3-bold text-inverse-text">Staff Rewards Program</h2>
            <p className="text-[14px] md:text-body-lg-reg text-inverse-text/80 leading-relaxed">
              Celebrate your team's craft. High performers this month are eligible for the Artisanal Roast certification.
            </p>
            <Button className="bg-brand-primary hover:bg-brand-accent text-white rounded-md h-11 md:h-12 w-full sm:w-fit px-xl font-bold transition-transform active:scale-95 text-sm">
              Configure Milestones
            </Button>
          </CardContent>
        </Card>

        {/* Branch Efficiency */}
        <Card className="bg-surface-accent border border-border-primary-50/10 shadow-sm rounded-md overflow-hidden flex flex-col items-center justify-center p-lg md:p-xl gap-md text-center">
          <div className="size-10 md:size-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-border-primary-50/10 mb-xs md:mb-sm">
            <Zap className="size-5 md:size-6 text-brand-primary fill-brand-primary" />
          </div>
          <div>
            <h3 className="text-body-md-bold md:text-h4-bold text-text-primary">Branch Efficiency</h3>
            <p className="text-[12px] md:text-body-sm-reg text-text-secondary mt-xs max-w-[200px]">
              Downtown Reserve is operating at peak staff-to-order ratio.
            </p>
          </div>
          <div className="w-full max-w-[220px] flex flex-col gap-sm mt-sm md:mt-md">
            <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary rounded-full shadow-[0_0_8px_rgba(240,102,10,0.5)]" style={{ width: "82%" }} />
            </div>
            <span className="text-[9px] md:text-[10px] text-brand-primary uppercase tracking-widest font-bold">82% Optimization</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
