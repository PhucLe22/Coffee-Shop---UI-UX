import { cn } from "@/shared/lib";
import { Badge, Button } from "@/shared/ui";
import { Order, OrderStatus } from "../model/types";

interface OrderCardProps {
  order: Order;
  onAction?: (order: Order) => void;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    placed: { label: "PLACED", className: "bg-warning" },
    preparing: { label: "PREPARING", className: "bg-info" },
    on_the_way: { label: "ON THE WAY", className: "bg-info" },
    delivered: { label: "DELIVERED", className: "bg-success" },
    cancelled: { label: "CANCELLED", className: "bg-error" },
    in_process: { label: "IN PROCESS", className: "bg-info" },
  };

const OrderCard = ({ order, onAction, className }: OrderCardProps) => {
  const status = statusConfig[order.status] || statusConfig.placed;

  return (
    <div
      className={cn(
        "flex flex-col gap-md rounded-[24px] border border-border-primary-50 bg-inverse-text p-[18px]",
        className,
      )}>
      {/* Header: ID, Date, Status */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-plus-jakarta text-[18px] font-bold leading-tight text-text-secondary">
            {order.orderNumber}
          </span>
          <span className="font-plus-jakarta text-[12px] font-bold text-text-muted">
            {order.createdAt}
          </span>
        </div>
        <Badge
          className={cn(
            "h-[25px] rounded-full px-4 text-[11px] font-semibold tracking-wider text-inverse-text border-none",
            status.className,
          )}>
          {status.label}
        </Badge>
      </div>

      {/* Content: Images and Items Summary */}
      <div className="flex items-center gap-md">
        <div className="flex items-center -space-x-4">
          {order.items.slice(0, 2).map((item, index) => (
            <div
              key={item.id}
              className="relative size-12 overflow-hidden rounded-[16px] border-2 border-inverse-text bg-surface-muted shadow-sm"
              style={{ zIndex: 2 - index }}>
              {/* Fallback if no image, in real app we'd have imageUrl in OrderItem */}
              <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary">
                {item.name.charAt(0)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="font-inter text-sm font-semibold text-text-primary line-clamp-1">
            {order.items
              .map((item) => `${item.quantity}x ${item.name}`)
              .join(", ")}
          </p>
          <p className="font-plus-jakarta text-[11px] text-text-muted line-clamp-1">
            {order.estimatedArrivalText || "Ghi chú: Không có"}
          </p>
        </div>
      </div>

      {/* Footer: Total and Action */}
      <div className="flex items-center justify-between border-t border-border-primary-50 pt-4">
        <div className="flex flex-col">
          <span className="font-plus-jakarta text-[10px] font-bold text-text-muted">
            TOTAL
          </span>
          <span className="font-plus-jakarta text-[18px] font-bold text-brand-primary">
            {order.totalPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-[16px] px-4 py-2 font-inter text-base font-bold text-text-secondary hover:bg-surface-muted"
          onClick={() => onAction?.(order)}>
          {order.status === "delivered" || order.status === "cancelled" ? (
            <>Buy again</>
          ) : (
            <>Detail</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
