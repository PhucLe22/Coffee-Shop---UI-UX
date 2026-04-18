import { Order } from "@/entities/order";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

interface OrderItemsSummaryProps {
  order: Order;
}

export function OrderItemsSummary({ order }: OrderItemsSummaryProps) {
  return (
    <Card className="bg-surface-muted border-none shadow-none rounded-md mx-md mt-lg">
      <CardHeader className="p-md">
        <CardTitle className="text-body-md-bold text-text-primary">
          Order Items
        </CardTitle>
      </CardHeader>
      <CardContent className="p-md pt-0 flex flex-col gap-md">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-start">
            <div className="flex gap-md">
              <div className="size-12 bg-surface-muted rounded-xs flex items-center justify-center border border-border-primary-50">
                <span className="text-label-badge text-brand-primary">
                  {item.quantity}x
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-body-sm-semibold text-text-primary">
                  {item.name}
                </span>
                {item.options && (
                  <span className="text-overline-inter text-text-secondary uppercase font-bold">
                    {item.options.join(" • ")}
                  </span>
                )}
              </div>
            </div>
            <span className="text-body-sm-semibold text-text-primary">
              ${item.price.toFixed(2)}
            </span>
          </div>
        ))}
      </CardContent>
      <Separator className=" w-auto bg-surface-muted border-t border-border-primary-50" />
      <CardFooter className="p-md flex justify-between items-center">
        <span className="text-body-md-bold text-text-secondary">Total</span>
        <span className="text-body-md-bold text-text-primary">
          ${order.totalPrice.toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
}
