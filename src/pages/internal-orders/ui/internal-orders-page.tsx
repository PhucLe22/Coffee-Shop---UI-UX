"use client";

import React, { useState } from "react";
import { 
  Clock, 
  ArrowUpRight,
  ClipboardList,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { cn, formatToVND } from "@/shared/lib/utils";
import { useInternalOrders, OrderStatus, useUpdateOrderStatus, OrderService } from "@/entities/order";
import { useStaffAuthStore } from "@/shared/auth";
import { StaffRole } from "@/shared/api/contracts";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const statusConfig: Record<string, { label: string; className: string; btnText: string; btnColor: string }> = {
  NEW: { 
    label: "MỚI", 
    className: "bg-orange-100 text-orange-700 border-orange-200",
    btnText: "Xác Nhận Đơn",
    btnColor: "bg-brand-primary hover:bg-brand-primary/90"
  },
  CONFIRMED: { 
    label: "ĐÃ XÁC NHẬN", 
    className: "bg-blue-100 text-blue-700 border-blue-200",
    btnText: "Bắt Đầu Chuẩn Bị",
    btnColor: "bg-blue-600 hover:bg-blue-700"
  },
  PREPARING: { 
    label: "ĐANG CHUẨN BỊ", 
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    btnText: "Đánh Dấu Sẵn Sàng",
    btnColor: "bg-indigo-600 hover:bg-indigo-700"
  },
  DELIVERING: {
    label: "ĐANG GIAO",
    className: "bg-purple-100 text-purple-700 border-purple-200",
    btnText: "Giao Cho Shipper",
    btnColor: "bg-purple-600 hover:bg-purple-700"
  },
  READY: { 
    label: "SẴN SÀNG", 
    className: "bg-green-100 text-green-700 border-green-200",
    btnText: "Hoàn Tất Đơn",
    btnColor: "bg-green-600 hover:bg-green-700"
  },
  COMPLETED: { 
    label: "HOÀN THÀNH", 
    className: "bg-gray-100 text-gray-700 border-gray-200",
    btnText: "Xem Hóa Đơn",
    btnColor: "bg-gray-600 hover:bg-gray-700"
  },
  CANCELLED: { 
    label: "ĐÃ HỦY", 
    className: "bg-red-100 text-red-700 border-red-200",
    btnText: "Chi Tiết",
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
  const queryClient = useQueryClient();
  const { mutate: completeOrder } = useMutation({
    mutationFn: (id: string) => OrderService.completeOrder(id),
    onSuccess: () => {
      toast.success("Đơn hàng đã hoàn tất");
      queryClient.invalidateQueries({ queryKey: ["internal-orders"] });
    },
    onError: () => toast.error("Không thể hoàn tất đơn hàng"),
  });
  const { mutate: cancelOrder } = useMutation({
    mutationFn: (id: string) => OrderService.cancelOrder(id),
    onSuccess: () => {
      toast.success("Đơn hàng đã hủy");
      queryClient.invalidateQueries({ queryKey: ["internal-orders"] });
    },
    onError: () => toast.error("Không thể hủy đơn hàng"),
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const canCompleteOrder = user?.role === StaffRole.ADMIN || 
                           user?.role === StaffRole.MANAGER || 
                           user?.role === StaffRole.CASHIER ||
                           user?.role === StaffRole.KITCHEN ||
                           user?.role === StaffRole.OWNER;

  const canCancelOrder = user?.role === StaffRole.ADMIN || 
                         user?.role === StaffRole.MANAGER;

  const handleStatusUpdate = (orderId: string | undefined, currentStatus: string, orderType: string) => {
    if (!orderId) return;
    
    // Check permissions if completing order
    if (currentStatus === "READY" && !canCompleteOrder) {
      alert("Bạn không có quyền hoàn tất đơn hàng này.");
      return;
    }

    // DELIVERY orders must be completed by shipper in /internal/delivery
    if (currentStatus === "READY" && orderType === "DELIVERY") {
      alert("Đơn giao hàng phải được hoàn tất bởi shipper.");
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

    // DINE_IN/TAKEAWAY complete uses dedicated endpoint
    if (currentStatus === "READY") {
      completeOrder(orderId, {
        onSettled: () => setUpdatingId(null),
      });
    } else {
      updateStatus(
        { id: orderId, status: nextStatus },
        { onSettled: () => setUpdatingId(null) },
      );
    }
  };

  const orders = data?.pages.flatMap((page) => page.data) || [];
  const meta = data?.pages[0]?.meta;

  const tabs = [
    { id: "ALL", label: "TẤT CẢ" },
    { id: "NEW", label: "CHỜ XỬ LÝ" },
    { id: "READY", label: "SẴN SÀNG" },
  ];

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col gap-sm">
        <span className="text-body-sm-bold text-brand-primary uppercase tracking-widest text-[10px]">Bảng Điều Khiển Vận Hành</span>
        <h1 className="text-body-md-bold md:text-h2-bold text-text-primary">Đơn Hàng Đang Xử Lý</h1>
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
          <p className="text-text-secondary font-medium">Đang tải đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-muted/30 rounded-md border border-dashed border-text-muted/30">
          <ClipboardList className="size-12 text-text-muted mb-4" />
          <p className="text-h4-bold text-text-muted">Không tìm thấy đơn hàng</p>
          <p className="text-body-sm-reg text-text-muted">Thử thay đổi bộ lọc</p>
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
                    order.status === "NEW" ? "bg-surface-muted border-[#f0660a]/20" : "bg-surface-accent border-transparent",
                    isThisUpdating && "opacity-70 scale-[0.99]"
                  )}
                >
                  <CardContent className="p-lg md:p-xl flex flex-col gap-md md:gap-lg h-full">
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Mã Đơn #{order.orderCode || order.id?.slice(0, 8)}</span>
                        <h3 className="text-body-lg-bold md:text-h3-bold text-text-primary">
                          {order.type} - {order.tableNumber ? `Bàn ${order.tableNumber}` : "Mang đi"}
                        </h3>
                      </div>
                      <Badge className={cn("rounded-full px-md py-1 border font-bold text-[9px] md:text-[10px] uppercase tracking-wider", config.className)}>
                        {config.label}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-md flex-1">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <ul className="flex flex-col gap-sm">
                          {order.orderItems.map((item: any, idx) => (
                            <li key={idx} className="flex flex-col gap-1 text-text-primary">
                              <div className="flex items-center gap-md">
                                <div className="size-1.5 rounded-full bg-text-primary shrink-0" />
                                <span className="text-body-sm-reg md:text-body-md-reg">{item.quantity}x {item.name}</span>
                                {item.price > 0 && <span className="text-body-sm-reg text-text-muted ml-auto">{Number(item.price).toLocaleString()}đ</span>}
                              </div>
                              {item.options && item.options.length > 0 && (
                                <div className="flex flex-wrap gap-1 ml-md pl-md">
                                  {item.options.map((opt: any) => (
                                    <span key={opt.id} className="text-[10px] md:text-[11px] text-text-muted bg-surface-muted/50 px-2 py-0.5 rounded-full">
                                      {opt.name}{opt.price > 0 ? ` (+${Number(opt.price).toLocaleString()}đ)` : ""}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-body-sm-reg text-text-muted italic">Không có sản phẩm nào</p>
                      )}
                      
                      {order.note && (
                        <div className="flex items-start gap-sm bg-white/30 p-sm rounded-sm border border-black/5 italic">
                          <AlertCircle className="size-4 text-brand-primary shrink-0 mt-0.5" />
                          <p className="text-[12px] md:text-[13px] text-text-secondary leading-snug">"{order.note}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-black/5 pt-md">
                      <span className="text-body-sm-bold text-text-secondary uppercase tracking-widest">Tổng Cộng</span>
                      <span className="text-h4-bold text-brand-primary">{formatToVND(Number(order.total))}</span>
                    </div>

                    {canCancelOrder && (
                      <Button
                        onClick={() => {
                          if (order.id && window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
                            cancelOrder(order.id);
                          }
                        }}
                        disabled={isThisUpdating}
                        className="w-full text-red-500 border border-red-200 bg-transparent hover:bg-red-50 rounded-md h-11 md:h-12 font-bold uppercase tracking-widest text-[11px] md:text-[12px] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <Trash2 className="size-4" />
                        Hủy Đơn Hàng
                      </Button>
                    )}

                    <Button 
                      onClick={() => handleStatusUpdate(order.id, order.status, order.type)}
                      disabled={isThisUpdating || (order.type === "DELIVERY" && (order.status === "READY" || order.status === "DELIVERING"))}
                      className={cn(
                        "w-full text-white rounded-md h-11 md:h-12 font-bold uppercase tracking-widest text-[11px] md:text-[12px] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2", 
                        config.btnColor,
                        order.type === "DELIVERY" && (order.status === "READY" || order.status === "DELIVERING") && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isThisUpdating ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : null}
                      {order.type === "DELIVERY" && (order.status === "READY" || order.status === "DELIVERING") ? "Giao Cho Shipper" : config.btnText}
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
                Tải Thêm Đơn Hàng
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
