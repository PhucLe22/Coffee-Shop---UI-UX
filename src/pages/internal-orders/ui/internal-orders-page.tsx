"use client";

import React, { useState } from "react";
import { 
  Clock, 
  ArrowUpRight,
  ClipboardList,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { cn, formatToVND } from "@/shared/lib/utils";
import { useInternalOrders, OrderStatus, useUpdateOrderStatus } from "@/entities/order";
import { useStaffAuthStore } from "@/shared/auth";
import { StaffRole } from "@/shared/api/contracts";

const statusConfig: Record<string, { label: string; className: string; btnText: string; btnColor: string }> = {
  NEW: { 
    label: "NEW", 
    className: "bg-orange-100 text-orange-700 border-orange-200",
    btnText: "Confirm Order",
    btnColor: "bg-brand-primary hover:bg-brand-primary/90"
  },
  CONFIRMED: { 
    label: "CONFIRMED", 
    className: "bg-blue-100 text-blue-700 border-blue-200",
    btnText: "Start Preparing",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  PREPARING: { 
    label: "PREPARING", 
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    btnText: "Mark as Ready",
    btnColor: "bg-indigo-600 hover:bg-indigo-700"
  },
  READY: { 
    label: "READY", 
    className: "bg-green-100 text-green-700 border-green-200",
    btnText: "Complete Order",
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  COMPLETED: { 
    label: "COMPLETED", 
    className: "bg-gray-100 text-gray-700 border-gray-200",
    btnText: "View Receipt",
    btnColor: "bg-gray-600 hover:bg-gray-700"
  },
  CANCELLED: { 
    label: "CANCELLED", 
    className: "bg-red-100 text-red-700 border-red-200",
    btnText: "Details",
    btnColor: "bg-red-600 hover:bg-red-700"
  },
};

export default function InternalOrdersPage() {
  const { user } = useStaffAuthStore();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInternalOrders({
    status: activeTab === "ALL" ? undefined : activeTab as OrderStatus,
    limit: 10,
  });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const canCompleteOrder = user?.role === StaffRole.ADMIN || 
                           user?.role === StaffRole.MANAGER || 
                           user?.role === StaffRole.CASHIER ||
                           user?.role === StaffRole.SHIPPER ||
                           user?.role === "STAFF";

  const handleStatusUpdate = (orderId: string | undefined, currentStatus: string) => {
    if (!orderId) return;
    
    // Check permissions if completing order
    if (currentStatus === "READY" && !canCompleteOrder) {
      alert("You do not have permission to complete this order.");
      return;
    }

    let nextStatus = "";
    switch (currentStatus) {
      case "NEW": nextStatus = "CONFIRMED"; break;
      case "CONFIRMED": nextStatus = "PREPARING"; break;
      case "PREPARING": nextStatus = "READY"; break;
      case "READY": nextStatus = "COMPLETED"; break;
      default: return;
    }
    
    setUpdatingId(orderId);
    updateStatus(
      { id: orderId, status: nextStatus },
      {
        onSettled: () => setUpdatingId(null)
      }
    );
  };

  const orders = data?.pages.flatMap((page) => page.data) || [];
  const meta = data?.pages[0]?.meta;

  const tabs = [
    { id: "ALL", label: "ALL ORDERS" },
    { id: "NEW", label: "PENDING" },
    { id: "READY", label: "READY" },
  ];

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col gap-sm">
        <span className="text-body-sm-bold text-brand-primary uppercase tracking-widest text-[10px]">Operations Dashboard</span>
        <h1 className="text-body-md-bold md:text-h2-bold text-text-primary">Active Orders</h1>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar pb-xs">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-text-primary text-white shadow-md" 
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            )}
          >
            {tab.label} {activeTab === tab.id && meta ? `(${meta.totalItems})` : ""}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="size-10 text-brand-primary animate-spin" />
          <p className="text-text-secondary font-medium">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-muted/30 rounded-md border border-dashed border-text-muted/30">
          <ClipboardList className="size-12 text-text-muted mb-4" />
          <p className="text-h4-bold text-text-muted">No orders found</p>
          <p className="text-body-sm-reg text-text-muted">Try changing your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-lg">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.NEW;
              const isThisUpdating = updatingId === order.id;
              
              return (
                <Card 
                  key={order.id} 
                  className={cn(
                    "border shadow-sm rounded-md overflow-hidden flex flex-col h-full transition-all duration-300",
                    order.status === "NEW" ? "bg-[#eae1d9] border-[#f0660a]/20" : "bg-[#fbf2ea] border-transparent",
                    isThisUpdating && "opacity-70 scale-[0.99]"
                  )}
                >
                  <CardContent className="p-lg md:p-xl flex flex-col gap-md md:gap-lg h-full">
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Order #{order.orderCode || order.id?.slice(0, 8)}</span>
                        <h3 className="text-body-lg-bold md:text-h3-bold text-text-primary">
                          {order.type} - {order.tableNumber ? `Table ${order.tableNumber}` : "To Go"}
                        </h3>
                      </div>
                      <Badge className={cn("rounded-full px-md py-1 border font-bold text-[9px] md:text-[10px] uppercase tracking-wider", config.className)}>
                        {order.status}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-md flex-1">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <ul className="flex flex-col gap-sm">
                          {order.orderItems.map((item: any, idx) => (
                            <li key={idx} className="flex items-center gap-md text-text-primary">
                              <div className="size-1.5 rounded-full bg-text-primary shrink-0" />
                              <span className="text-body-sm-reg md:text-body-md-reg">{item.quantity}x {item.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-body-sm-reg text-text-muted italic">No items listed</p>
                      )}
                      
                      {order.note && (
                        <div className="flex items-start gap-sm bg-white/30 p-sm rounded-sm border border-black/5 italic">
                          <AlertCircle className="size-4 text-brand-primary shrink-0 mt-0.5" />
                          <p className="text-[12px] md:text-[13px] text-[#386661] leading-snug">"{order.note}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-black/5 pt-md">
                      <span className="text-body-sm-bold text-text-secondary uppercase tracking-widest">Total</span>
                      <span className="text-h4-bold text-brand-primary">{formatToVND(Number(order.total))}</span>
                    </div>

                    <Button 
                      onClick={() => handleStatusUpdate(order.id, order.status)}
                      disabled={isThisUpdating}
                      className={cn(
                        "w-full text-white rounded-md h-11 md:h-12 font-bold uppercase tracking-widest text-[11px] md:text-[12px] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2", 
                        config.btnColor
                      )}
                    >
                      {isThisUpdating ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      {config.btnText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center mt-lg">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="rounded-full px-10 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold uppercase tracking-widest text-[11px]"
              >
                {isFetchingNextPage ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <ArrowUpRight className="size-4 mr-2" />
                )}
                Load More Orders
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
