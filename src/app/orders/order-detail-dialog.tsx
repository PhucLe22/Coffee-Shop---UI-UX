"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Badge, AppButton } from "@/shared/ui";
import { useOrderByCode } from "@/entities/order";
import { formatToVND } from "@/shared/lib";
import { Loader2, X } from "lucide-react";

interface OrderDetailDialogProps {
  orderCode: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "Mới", className: "bg-warning" },
  CONFIRMED: { label: "Đã xác nhận", className: "bg-info" },
  PREPARING: { label: "Đang chuẩn bị", className: "bg-info" },
  READY: { label: "Sẵn sàng", className: "bg-info" },
  COMPLETED: { label: "Hoàn thành", className: "bg-success" },
  CANCELLED: { label: "Đã hủy", className: "bg-error" },
  REFUNDED: { label: "Đã hoàn tiền", className: "bg-error" },
};

export function OrderDetailDialog({ orderCode, open, onOpenChange }: OrderDetailDialogProps) {
  const { data: response, isLoading } = useOrderByCode(orderCode);
  const order = response?.data;
  const items = (order as any)?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b border-border-primary-50 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-h5-bold text-text-primary">
                Đơn hàng #{order?.orderCode?.slice(-8) ?? ""}
              </DialogTitle>
              <DialogDescription className="text-left mt-1">
                {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : ""}
              </DialogDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="size-8 flex items-center justify-center rounded-full hover:bg-surface-muted transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-brand-primary" />
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center py-20 text-text-muted">
            Không tìm thấy đơn hàng
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4 pt-2">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-body-sm-semibold text-text-muted uppercase tracking-wider">
                Trạng thái
              </span>
              <Badge
                className={`h-[25px] rounded-full px-4 text-[11px] font-semibold tracking-wider text-inverse-text border-none ${
                  statusConfig[order.status]?.className || "bg-warning"
                }`}
              >
                {statusConfig[order.status]?.label || order.status}
              </Badge>
            </div>

            {/* Items */}
            {items.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-body-sm-semibold text-text-muted uppercase tracking-wider">
                  Sản phẩm
                </span>
                <div className="flex flex-col gap-2 rounded-md bg-surface-muted p-3">
                  {items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-body-sm-bold text-text-primary">
                          {item.quantity}x {item.name}
                        </span>
                        {item.options?.length > 0 && (
                          <span className="text-[11px] text-text-muted">
                            {item.options.map((o: any) => o.name).join(" • ")}
                          </span>
                        )}
                      </div>
                      <span className="text-body-sm-bold text-text-primary">
                        {formatToVND(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Info */}
            <div className="flex flex-col gap-2">
              <span className="text-body-sm-semibold text-text-muted uppercase tracking-wider">
                Thông tin đơn hàng
              </span>
              <div className="rounded-md bg-surface-muted p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-body-sm-reg text-text-muted">Mã đơn</span>
                  <span className="text-body-sm-bold text-text-primary">{order.orderCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm-reg text-text-muted">Loại</span>
                  <span className="text-body-sm-bold text-text-primary">
                    {order.type === "DELIVERY" ? "Giao hàng" : order.type === "TAKEAWAY" ? "Mang về" : "Tại chỗ"}
                  </span>
                </div>
                {order.address && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Địa chỉ</span>
                    <span className="text-body-sm-bold text-text-primary text-right max-w-[200px]">{order.address}</span>
                  </div>
                )}
                {order.store?.name && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Cửa hàng</span>
                    <span className="text-body-sm-bold text-text-primary">{order.store.name}</span>
                  </div>
                )}
                {order.note && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Ghi chú</span>
                    <span className="text-body-sm-bold text-text-primary">{order.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="flex flex-col gap-2">
              <span className="text-body-sm-semibold text-text-muted uppercase tracking-wider">
                Thanh toán
              </span>
              <div className="rounded-md bg-surface-muted p-3 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-body-sm-reg text-text-muted">Tạm tính</span>
                  <span className="text-body-sm-bold text-text-primary">{formatToVND(Number(order.subtotal))}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Giảm giá</span>
                    <span className="text-body-sm-bold text-success">-{formatToVND(Number(order.discount))}</span>
                  </div>
                )}
                {Number(order.tax) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Thuế</span>
                    <span className="text-body-sm-bold text-text-primary">{formatToVND(Number(order.tax))}</span>
                  </div>
                )}
                {Number(order.serviceFee) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-body-sm-reg text-text-muted">Phí dịch vụ</span>
                    <span className="text-body-sm-bold text-text-primary">{formatToVND(Number(order.serviceFee))}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border-primary-50 pt-2">
                  <span className="text-body-md-bold text-text-primary">Tổng cộng</span>
                  <span className="text-body-md-bold text-brand-primary">{formatToVND(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
