import { OrderItem, FALLBACK_PRODUCT_IMAGE } from "../model/chat-store";
import { Badge } from "@/shared/ui";

interface AIOrderStatusProps {
  id: string;
  status: string;
  items: OrderItem[];
}

export function AIOrderStatus({ id, status, items }: AIOrderStatusProps) {
  return (
    <div className="bg-surface-accent rounded-lg border border-text-primary/10 p-md flex flex-col gap-md">
      <div className="flex items-center justify-between border-b border-text-primary/10 pb-sm">
        <span className="text-body-sm-semibold text-text-secondary">
          Order {id}
        </span>
        <Badge variant="secondary" className="bg-info/20 text-info border-none">
          {status}
        </Badge>
      </div>
      <div className="flex flex-col gap-sm">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-md border border-[#DDCBC3] p-xs rounded-sm">
            <div className="size-12 rounded-md overflow-hidden bg-white shrink-0">
              <img
                src={item.image || FALLBACK_PRODUCT_IMAGE}
                alt={item.name}
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-body-sm-semibold text-text-primary">
                {item.name}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-overline-inter text-text-muted">
                  {item.quantity}
                </span>
                <span className="text-body-sm-semibold text-text-primary">
                  {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
