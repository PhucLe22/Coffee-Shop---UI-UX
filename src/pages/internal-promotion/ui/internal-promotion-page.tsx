"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, Percent, DollarSign, Hash, Repeat } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useInfiniteVouchers, VoucherOutput } from "@/entities/voucher";
import { CreateVoucherDialog } from "@/features/create-voucher";
import { UpdateVoucherDialog } from "@/features/update-voucher";

export default function PromotionsPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherOutput | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVouchers({ limit: 10 });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const vouchers = data?.pages?.flatMap((p) => p?.data ?? []).filter(Boolean) ?? [];

  const getDiscountLabel = (voucher: VoucherOutput) => {
    if (voucher.discountType === "PERCENT") return `${voucher.discountValue}%`;
    if (voucher.discountValue) return `${voucher.discountValue.toLocaleString()}đ`;
    return "N/A";
  };

  const getStatusBadge = (voucher: VoucherOutput) => {
    if (!voucher.isActive) {
      return <Badge variant="destructive" className="text-[10px] uppercase tracking-widest">Inactive</Badge>;
    }
    if (voucher.expiresAt && new Date(voucher.expiresAt) < new Date()) {
      return <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-text-muted border-border">Expired</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-0 text-[10px] uppercase tracking-widest">Active</Badge>;
  };

  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-body-md-bold md:text-h3-bold text-text-primary">Voucher Management</h1>
          <p className="text-[12px] md:text-body-sm-reg text-text-secondary">Create and manage discount vouchers</p>
        </div>
        <div className="flex items-center gap-sm md:gap-md">
          <CreateVoucherDialog />
        </div>
      </div>

      {/* Voucher List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-white border-0 shadow-sm rounded-md overflow-hidden">
              <CardContent className="p-lg space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-md">
          <Ticket className="size-16 text-text-muted/30" />
          <p className="text-body-md-reg text-text-secondary">No vouchers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
          {vouchers.map((voucher) => (
            <Card
              key={voucher.id}
              className="bg-white border-0 shadow-sm rounded-md overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
              onClick={() => {
                setSelectedVoucher(voucher);
                setUpdateOpen(true);
              }}
            >
              <CardContent className="p-lg flex flex-col gap-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-md">
                    <div className="size-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <Ticket className="size-5 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-body-md-bold text-text-primary font-mono tracking-wide">{voucher.code}</h3>
                      <p className="text-[11px] text-text-muted uppercase tracking-widest">{voucher.discountType || "N/A"}</p>
                    </div>
                  </div>
                  {getStatusBadge(voucher)}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-h3-bold text-brand-primary">{getDiscountLabel(voucher)}</span>
                  {voucher.discountType === "PERCENT" && voucher.maxDiscount && (
                    <span className="text-body-sm-reg text-text-muted">
                      (max {voucher.maxDiscount.toLocaleString()}đ)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-sm text-[12px]">
                  {voucher.minOrderAmount != null && (
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <DollarSign className="size-3.5" />
                      <span>Min: {voucher.minOrderAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  {voucher.maxUsage != null && (
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Repeat className="size-3.5" />
                      <span>Max: {voucher.maxUsage}</span>
                    </div>
                  )}
                  {voucher.usedCount != null && (
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Hash className="size-3.5" />
                      <span>Used: {voucher.usedCount}</span>
                    </div>
                  )}
                  {voucher.expiresAt && (
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar className="size-3.5" />
                      <span className="truncate">{new Date(voucher.expiresAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update Dialog */}
      {selectedVoucher && (
        <UpdateVoucherDialog
          voucher={selectedVoucher}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
        />
      )}
    </div>
  );
}
