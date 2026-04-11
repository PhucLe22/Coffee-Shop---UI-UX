"use client";

import React, { useState } from "react";
import { cn } from "@/shared/lib";
import { Order, OrderCard, OrderStatus } from "@/entities/order";

const TABS = [
  { id: "all", label: "All" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface OrderHistoryProps {
  orders: Order[];
  className?: string;
}

export const OrderHistory = ({ orders, className }: OrderHistoryProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });

  return (
    <div className={cn("flex flex-col gap-lg", className)}>
      {/* Tab Bar */}
      <div className="flex h-[49px] w-full items-center justify-between rounded-[16px] bg-surface-muted p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex h-[33px] flex-1 items-center justify-center rounded-[8px] font-inter text-sm font-semibold transition-all",
              activeTab === tab.id
                ? "bg-surface-main text-brand-primary"
                : "text-text-muted"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-md">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAction={(o) => console.log("Action on order", o.id)}
            />
          ))
        ) : (
          <div className="flex h-40 items-center justify-center rounded-[24px] border border-dashed border-border-primary-50 text-text-muted">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};
