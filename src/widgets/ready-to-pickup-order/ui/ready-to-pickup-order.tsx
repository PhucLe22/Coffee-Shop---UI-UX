import { Order } from "@/entities/order";
import { Badge } from "@/shared/ui";

interface ReadyToPickUpOrderProps {
  order: Order;
}

export const ReadyToPickUpOrder = ({ order }: ReadyToPickUpOrderProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-border-primary-50 bg-surface-muted p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="label-badge text-text-primary">
          IN-STORE PICKUP
        </span>
        <Badge className="rounded-full bg-success px-4 py-1 text-[11px] font-semibold text-white border-none">
          READY
        </Badge>
      </div>

      <p className="mb-6 label-caption text-text-primary">
        {order.createdAt} • Order #{order.orderNumber}
      </p>

      {/* Item Card */}
      <div className="rounded-md border border-border-primary-50 bg-surface-main p-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex flex-col">
            <span className="label-caption text-text-primary">
              {order.items[0]?.name}
            </span>
            <span className="label-badge text-text-primary">
              {order.items[0]?.options?.join(", ")}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-border-primary-50 pt-2">
          <span className="label-badge text-text-primary">
            Total
          </span>
          <span className="text-body-sm-semibold text-brand-primary">
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
