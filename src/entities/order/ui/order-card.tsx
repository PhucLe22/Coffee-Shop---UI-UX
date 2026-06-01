import { cn, formatToVND } from "@/shared/lib";
import { Badge, AppButton } from "@/shared/ui";
import { Order } from "../model/types";
import { RotateCcw, ChevronRight } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onAction?: (order: Order) => void;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  NEW: { label: "NEW", className: "bg-warning" },
  CONFIRMED: { label: "CONFIRMED", className: "bg-info" },
  PREPARING: { label: "PREPARING", className: "bg-info" },
  READY: { label: "READY", className: "bg-info" },
  COMPLETED: { label: "COMPLETED", className: "bg-success" },
  CANCELLED: { label: "CANCELLED", className: "bg-error" },
  REFUNDED: { label: "REFUNDED", className: "bg-error" },
};

const OrderCard = ({ order, onAction, className }: OrderCardProps) => {
  const status = statusConfig[order.status] || statusConfig.NEW;
  const isCompleted =
    order.status === "COMPLETED" || order.status === "CANCELLED";

  // Handle items if they exist (they might not be in the summary list)
  const items = (order as any).items || [];
  const orderNumber = order.orderCode || (order.id ? order.id.slice(0, 8).toUpperCase() : "UNKNOWN");

  return (
    <div
      className={cn(
        "flex flex-col gap-lg rounded-[32px] border border-border-primary-50 bg-surface-main p-6 shadow-sm",
        className,
      )}>
      {/* Header: ID, Date, Status */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-plus-jakarta text-[18px] font-bold leading-tight text-text-secondary">
            #{orderNumber}
          </span>
          <span className="font-plus-jakarta text-[12px] font-bold text-text-muted">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Badge
          className={cn(
            "h-[25px] rounded-full px-4 text-[11px] font-semibold tracking-wider text-inverse-text border-none",
            status.className,
          )}>
          {status.label.toUpperCase()}
        </Badge>
      </div>

      {/* Content: Images and Items Summary */}
      <div className="flex items-center gap-md">
        <div className="flex items-center">
          {items.length > 0 ? (
            items.slice(0, 2).map((item: any, index: number) => (
              <div
                key={item.id}
                className={cn(
                  "relative size-12 overflow-hidden rounded-2xl border-2 border-surface-main bg-stone-200 shadow-sm",
                  index > 0 && "-ml-6",
                )}
                style={{ zIndex: 2 - index }}>
                <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary font-bold">
                  {item.name.charAt(0)}
                </div>
              </div>
            ))
          ) : (
            <div className="relative size-12 overflow-hidden rounded-2xl border-2 border-surface-main bg-stone-200 shadow-sm">
              <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary font-bold">
                O
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-inter text-sm font-semibold text-text-primary line-clamp-1">
            {items.length > 0
              ? items.map((item: any) => `${item.quantity}x ${item.name}`).join(", ")
              : `Order from ${order.store.name}`}
          </p>
          <p className="font-plus-jakarta text-[11px] text-text-muted line-clamp-1">
            {order.address || order.store.address}
          </p>
        </div>
      </div>

      {/* Footer: Total and Action */}
      <div className="flex items-center justify-between border-t border-text-primary/5 pt-4">
        <div className="flex flex-col">
          <span className="font-plus-jakarta text-[10px] font-bold text-text-muted uppercase tracking-wider">
            TOTAL
          </span>
          <span className="font-plus-jakarta text-[18px] font-bold text-brand-primary">
            {formatToVND(order.total)}đ
          </span>
        </div>

        <AppButton
          variant="secondary"
          size="sm"
          className="rounded-xl px-4 py-2 font-bold"
          onClick={() => onAction?.(order)}>
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4" />
              <span>{isCompleted ? "Buy again" : "Detail"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Chi tiết</span>
              <ChevronRight className="size-4" />
            </div>
          )}
        </AppButton>
      </div>
    </div>
  );
};

export default OrderCard;
