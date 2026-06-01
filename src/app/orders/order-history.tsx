"use client";

import React, { useState } from "react";
import { cn } from "@/shared/lib";
import { OrderCard } from "@/entities/order";
import { ClipboardList } from "lucide-react";
import { OrderHistoryCard } from "@/widgets/order-history-card";
import { useIsMobile } from "@/shared/lib";
import { OrderOutput, OrderStatus } from "@/shared/api";

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: OrderStatus.NEW, label: "Mới" },
  { id: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
  { id: OrderStatus.COMPLETED, label: "Hoàn thành" },
  { id: OrderStatus.CANCELLED, label: "Đã hủy" },
] as const;

interface OrderHistoryProps {
  orders: OrderOutput[];
  className?: string;
  showHeader?: boolean;
  activeStatus?: OrderStatus | "all";
  onStatusChange?: (status: OrderStatus | undefined) => void;
}

export const OrderHistory = ({
  orders,
  className,
  showHeader = true,
  activeStatus = "all",
  onStatusChange,
}: OrderHistoryProps) => {
  const isMobile = useIsMobile();
  const [localActiveTab, setLocalActiveTab] = useState<string>("all");

  const activeTab = onStatusChange ? activeStatus : localActiveTab;

  const handleTabClick = (id: string) => {
    if (onStatusChange) {
      onStatusChange(id === "all" ? undefined : id as OrderStatus);
    } else {
      setLocalActiveTab(id);
    }
  };

  const filteredOrders = onStatusChange 
    ? orders 
    : orders.filter((order) => {
        if (activeTab === "all") return true;
        return order.status === activeTab;
      });

  return (
    <div className={cn("flex flex-col gap-lg", className)}>
      {showHeader && (
        <h1 className="text-h2-bold text-text-primary px-1">Lịch sử đơn hàng</h1>
      )}

      {/* Tab Bar */}
      <div className={cn(
        "flex h-14 w-full items-center gap-2 overflow-x-auto no-scrollbar rounded-2xl p-1.5 shadow-inner transition-all",
        !isMobile ? "bg-[#ebe0d9]" : "bg-surface-muted"
      )}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex h-full min-w-[80px] flex-1 items-center justify-center rounded-lg font-plus-jakarta text-[12px] md:text-sm font-bold transition-all px-4 whitespace-nowrap",
              activeTab === tab.id
                ? (!isMobile ? "bg-[#fff8f3] text-brand-primary shadow-sm" : "bg-surface-main text-brand-primary shadow-sm")
                : "text-text-muted hover:text-text-primary"
            )}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-lg mt-2">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            !isMobile ? (
              <OrderHistoryCard key={order.id} order={order as any} />
            ) : (
              <OrderCard
                key={order.id}
                order={order as any}
                onAction={(o) => console.log("Action on order", o.id)}
              />
            )
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-muted rounded-[32px] border border-dashed border-border-primary-50">
            <ClipboardList className="size-12 text-text-muted/30 mb-4" />
            <p className="text-body-md-bold text-text-muted">Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};
