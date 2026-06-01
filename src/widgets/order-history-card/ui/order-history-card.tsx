'use client';

import { useState } from "react";
import { Order, useOrderByCode } from "@/entities/order";
import { Badge, AppButton } from "@/shared/ui";
import { cn, formatToVND } from "@/shared/lib";
import { ChevronDown, MapPin, RotateCcw, Loader2 } from "lucide-react";

interface OrderHistoryCardProps {
  order: Order;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  NEW: { label: "MỚI", color: "#f59e0b" },
  CONFIRMED: { label: "XÁC NHẬN", color: "#3b82f6" },
  PREPARING: { label: "ĐANG CHUẨN BỊ", color: "#3b82f6" },
  READY: { label: "SẴN SÀNG", color: "#3b82f6" },
  COMPLETED: { label: "HOÀN THÀNH", color: "#10b981" },
  CANCELLED: { label: "ĐÃ HUỶ", color: "#ef4444" },
  REFUNDED: { label: "HOÀN TIỀN", color: "#ef4444" },
};

export const OrderHistoryCard = ({ order }: OrderHistoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[order.status] || statusConfig.NEW;

  const { data: orderDetails, isLoading } = useOrderByCode(
    isExpanded && (!order.items || order.items.length === 0)
      ? order.orderCode || null
      : null
  );

  const displayItems =
    order.items && order.items.length > 0
      ? order.items
      : orderDetails?.data.orderItems?.map((item, index) => ({
          id: `${index}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
        })) || [];

  const orderNumber =
    order.orderCode ||
    (order.id ? order.id.slice(0, 8).toUpperCase() : "UNKNOWN");

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-text-primary/10 bg-[#ebe0d9] shadow-sm transition-all duration-300">
      {/* Summary Header */}
      <div 
        className="flex items-center justify-between p-8 cursor-pointer hover:bg-black/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-20 flex-1">
          {/* Order Info */}
          <div className="flex flex-col gap-1 min-w-[200px]">
            <span className="text-[18px] font-bold font-plus-jakarta text-text-primary uppercase tracking-wide">
              ORDER #{orderNumber}
            </span>
            <span className="text-[14px] font-medium font-plus-jakarta text-text-muted opacity-80">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2 min-w-[120px]">
            <span className="text-[12px] font-bold font-plus-jakarta text-text-muted uppercase tracking-wider">
              STATUS
            </span>
            <Badge 
              className="h-[28px] w-fit rounded-full px-5 text-[11px] font-bold text-inverse-text border-none shadow-sm"
              style={{ backgroundColor: status.color }}
            >
              {status.label}
            </Badge>
          </div>

          {/* Total */}
          <div className="flex flex-col gap-1 min-w-[100px]">
            <span className="text-[12px] font-bold font-plus-jakarta text-text-muted uppercase tracking-wider">
              TOTAL
            </span>
            <span className="text-[20px] font-extrabold font-plus-jakarta text-text-primary">
              {formatToVND(order.total)}đ
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <AppButton 
            variant="ghost" 
            className="rounded-full px-8 h-12 font-bold text-[16px] text-text-primary hover:bg-surface-main transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Navigate to detail
            }}
          >
            Xem chi tiết
          </AppButton>
          <ChevronDown className={cn("size-6 text-text-muted transition-transform duration-300", isExpanded && "rotate-180")} />
        </div>
      </div>

      {/* Expanded Content */}
      <div className={cn(
        "grid transition-all duration-300 ease-in-out",
        isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="p-8 pt-0 flex flex-col gap-8">
            <div className="h-px w-full bg-text-primary/10" />
            
            {/* Delivery Details */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[16px] font-bold font-plus-jakarta text-text-primary uppercase tracking-wide">
                ĐỊA CHỈ GIAO HÀNG
              </h4>
              <div className="flex items-center gap-3 text-text-muted">
                <MapPin className="size-5 shrink-0" />
                <p className="text-[15px] font-medium font-inter">
                  {order.address || order.store.address}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="flex gap-10">
              <div className="size-[180px] shrink-0 overflow-hidden rounded-2xl border border-text-primary/10 bg-white/10 shadow-md">
                <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary font-bold text-4xl">
                  {order.store.name.charAt(0)}
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between py-2">
                <div className="flex flex-col gap-6">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-text-muted italic">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tải chi tiết sản phẩm...
                    </div>
                  ) : displayItems.length > 0 ? (
                    displayItems.map((item: any) => (
                      <div key={item.id} className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <span className="text-[20px] font-bold font-plus-jakarta text-text-primary">
                            {item.name}
                          </span>
                          <span className="text-[14px] font-medium font-inter text-text-muted opacity-80">
                            {item.quantity}x • {item.options?.join(", ") || "Regular"}
                          </span>
                        </div>
                        <span className="text-[18px] font-bold font-plus-jakarta text-text-primary">
                          {formatToVND(item.price * item.quantity)}đ
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-text-muted italic">
                      Chi tiết sản phẩm không khả dụng trong danh sách này.
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-text-primary/5">
                  <div className="flex items-center gap-3">
                    <span className="text-[18px] font-bold font-plus-jakarta text-text-primary">Total:</span>
                    <span className="text-[32px] font-extrabold font-plus-jakarta text-[#f0660a]">{formatToVND(order.total)}đ</span>
                  </div>
                  <AppButton 
                    variant="primary" 
                    className="rounded-full px-12 h-14 font-bold text-[16px] shadow-lg active:scale-95 transition-all"
                  >
                    <RotateCcw className="size-5 mr-2" />
                    ĐẶT LẠI
                  </AppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
