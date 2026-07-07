"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MapPin,
  Loader2,
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useStaffList } from "@/entities/staff";
import { StaffOutput, StaffRole } from "@/shared/api";
import { CreateStaffDialog } from "@/features/create-staff";
import { UpdateStaffDialog } from "@/features/update-staff";

const ROLE_TABS = [
  { label: "Tất Cả", value: null },
  { label: "Thu Ngân", value: "CASHIER" as StaffRole },
  { label: "Quản Lý", value: "MANAGER" as StaffRole },
  { label: "Bếp", value: "KITCHEN" as StaffRole },
  { label: "Giao Hàng", value: "SHIPPER" as StaffRole },
];

export default function StaffPage() {
  const [activeRole, setActiveRole] = useState<StaffRole | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<StaffOutput | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  const { data, isLoading } = useStaffList({
    page: currentPage,
    limit: 10,
    ...(activeRole ? { role: activeRole } : {}),
  });

  const staffList = data?.data ?? [];
  const metadata = data?.meta;
  const totalPages = metadata?.totalPages ?? 1;
  const totalItems = metadata?.totalItems ?? 0;

  const handleTabChange = (role: StaffRole | null) => {
    setActiveRole(role);
    setCurrentPage(1);
  };

  const handleEdit = (staff: StaffOutput) => {
    setSelectedStaff(staff);
    setUpdateOpen(true);
  };

  const roleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      CASHIER: "bg-blue-100 text-blue-700",
      MANAGER: "bg-orange-100 text-orange-700",
      KITCHEN: "bg-purple-100 text-purple-700",
      SHIPPER: "bg-teal-100 text-teal-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-body-md-bold md:text-h3-bold text-text-primary">Quản Lý Nhân Viên</h1>
          <p className="text-[12px] md:text-body-sm-reg text-text-secondary">Quản lý đội ngũ nhân viên trên tất cả cửa hàng</p>
        </div>
        <div className="flex items-center gap-sm md:gap-md">
          <CreateStaffDialog />
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center bg-surface-muted/30 p-1 rounded-md border border-border-primary-50 w-full md:w-fit overflow-x-auto no-scrollbar">
        {ROLE_TABS.map((tab) => (
          <Button
            key={tab.label}
            variant="ghost"
            size="sm"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "rounded-sm h-8 px-md text-[12px] md:text-body-sm-semibold transition-all whitespace-nowrap",
              activeRole === tab.value
                ? "bg-white text-brand-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Staff List */}
      <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden">
        {isLoading ? (
          <div className="p-lg space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="size-8" />
              </div>
            ))}
          </div>
        ) : staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md">
            <UserPlus className="size-16 text-text-muted/30" />
            <p className="text-body-md-reg text-text-secondary">Không tìm thấy nhân viên</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-accent/30 text-left border-b border-border-primary-50/10">
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Nhân Viên</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Vai Trò</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Cửa Hàng</th>
                    <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Trạng Thái</th>
                    <th className="p-lg text-right text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="border-b border-border-primary-50/5 hover:bg-surface-main/30 transition-colors group">
                      <td className="p-lg">
                        <div className="flex items-center gap-md">
                          <Avatar className="size-10 border border-border-primary-50/20 shadow-sm">
                            <AvatarImage src="" alt={staff.name ?? ""} />
                            <AvatarFallback>{(staff.name ?? staff.email).charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-body-md-bold text-text-primary">{staff.name || "—"}</span>
                            <span className="text-body-sm-reg text-text-muted">{staff.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-lg">
                        <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[10px] uppercase tracking-wide", roleBadgeColor(staff.role))}>
                          {staff.role}
                        </Badge>
                      </td>
                      <td className="p-lg">
                        <div className="flex items-center gap-xs text-text-primary">
                          <MapPin className="size-3 text-brand-primary shrink-0" />
                          <span className="text-body-sm-semibold">{staff.storeName}</span>
                        </div>
                      </td>
                      <td className="p-lg">
                        <Badge className={cn(
                          "rounded-full px-md py-0.5 border-0 font-bold text-[10px] uppercase tracking-wide",
                          staff.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}>
                          {staff.isActive ? "Hoạt Động" : "Ngừng Hoạt Động"}
                        </Badge>
                      </td>
                      <td className="p-lg text-right">
                        <div className="flex items-center justify-end gap-sm">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-md"
                            onClick={() => handleEdit(staff)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-text-muted hover:text-error hover:bg-error/5 rounded-md"
                            onClick={() => {
                              setSelectedStaff(staff);
                              setUpdateOpen(true);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col">
              {staffList.map((staff) => (
                <div key={staff.id} className="p-md border-b border-border-primary-50/10 flex flex-col gap-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-md">
                      <Avatar className="size-10 border border-border-primary-50/20 shadow-sm">
                        <AvatarImage src="" alt={staff.name ?? ""} />
                        <AvatarFallback>{(staff.name ?? staff.email).charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-body-sm-bold text-text-primary">{staff.name || "—"}</span>
                        <span className="text-[11px] text-text-muted truncate max-w-[150px]">{staff.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-text-muted rounded-md"
                        onClick={() => handleEdit(staff)}
                      >
                        <Edit className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-sm">
                    <Badge className={cn("rounded-full px-md py-0.5 border-0 font-bold text-[9px] uppercase tracking-wide", roleBadgeColor(staff.role))}>
                      {staff.role}
                    </Badge>
                    <Badge className={cn(
                      "rounded-full px-md py-0.5 border-0 font-bold text-[9px] uppercase tracking-wide",
                      staff.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}>
                      {staff.isActive ? "Hoạt Động" : "Ngừng Hoạt Động"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-xs text-text-primary">
                    <MapPin className="size-3 text-brand-primary shrink-0" />
                    <span className="text-[11px] font-semibold">{staff.storeName}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-md md:p-lg bg-surface-accent/10 flex flex-col sm:flex-row items-center justify-between gap-md border-t border-border-primary-50/10">
                <p className="text-[12px] md:text-body-sm-semibold text-text-secondary order-2 sm:order-1">
                  Hiển thị {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalItems)} trên {totalItems} Nhân Viên
                </p>
                <div className="flex items-center gap-xs order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 md:size-9 border-border-primary-50 rounded-md"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      className={cn(
                        "size-8 md:size-9 rounded-md font-bold text-[12px]",
                        pageNum === currentPage
                          ? "bg-text-primary text-white"
                          : "text-text-secondary font-medium hover:bg-surface-muted"
                      )}
                      variant={pageNum === currentPage ? "default" : "ghost"}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 md:size-9 border-border-primary-50 rounded-md"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Update Dialog */}
      {selectedStaff && (
        <UpdateStaffDialog
          staff={selectedStaff}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
        />
      )}
    </div>
  );
}
