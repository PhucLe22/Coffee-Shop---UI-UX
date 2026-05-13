import { Order } from "@/entities/order";
import { Badge, AppButton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface ActiveProcessingOrderProps {
  order: Order;
}

export const ActiveProcessingOrder = ({ order }: ActiveProcessingOrderProps) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-border-primary-50 bg-surface-muted p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xs bg-surface-main px-4 py-1">
            <span className="label-badge text-text-primary uppercase">
              ORDER #{order.orderNumber}
            </span>
          </div>
          <span className="label-caption text-text-muted">
            {order.createdAt}
          </span>
        </div>
        <Badge className="rounded-full bg-info px-4 py-1 text-[11px] font-semibold text-white border-none">
          ĐANG GIAO
        </Badge>
      </div>

      {/* Content */}
      <div className="flex gap-8 mb-8">
        <div className="size-[192px] overflow-hidden rounded-md border border-border-primary-50">
          <img
            src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"
            alt="Product"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="text-h3-bold text-text-primary">
                    {item.name}
                  </h3>
                  <p className="text-body-sm-reg text-text-muted">
                    {item.options?.join(", ")}
                  </p>
                </div>
                <span className="text-body-md-bold text-text-primary">
                  ${item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <span className="text-h5-bold text-text-primary">
              Total:
            </span>
            <span className="text-h2-bold text-brand-primary">
              ${order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-border-primary-50 pt-6 flex justify-end">
        <AppButton variant="secondary" className="px-8">
          THEO DÕI ĐƠN HÀNG
        </AppButton>
      </div>
    </div>
  );
};
