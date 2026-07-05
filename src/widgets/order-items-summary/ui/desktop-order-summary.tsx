import { Order } from "@/entities/order";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { formatToVND } from "@/shared/lib";

interface DesktopOrderSummaryProps {
  order: Order;
}

export function DesktopOrderSummary({ order }: DesktopOrderSummaryProps) {
  const total = typeof order.total === 'string' ? parseFloat(order.total) : (order.total || 0);
  const subtotal = total - 2.0; // Mock delivery fee subtraction
  const deliveryFee = 2.0;
  const items = order.orderItems || [];

  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardHeader className="p-xl pb-md">
        <CardTitle className="text-h3-bold text-text-primary">
          Tóm Tắt Đơn Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="p-xl pt-0 flex flex-col gap-lg">
        {items.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex justify-between items-center">
            <div className="flex gap-md items-center">
              <div className="size-16 rounded-md bg-surface-muted overflow-hidden shrink-0 border border-border-primary-50 flex items-center justify-center">
                {/* Fallback image style */}
                <div className="text-brand-primary text-body-md-bold">
                  {item.quantity}x
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-h4-bold text-text-primary">
                  {item.name}
                </span>
                {item.options && (
                  <span className="text-body-sm-reg text-text-secondary">
                    {item.options.join(" • ")}
                  </span>
                )}
              </div>
            </div>
            <span className="text-h5-bold text-text-primary">
              {formatToVND(item.price)}
            </span>
          </div>
        ))}
      </CardContent>

      <div className="p-xl flex flex-col gap-md">
        <div className="flex justify-between items-center text-body-md-bold text-text-muted">
          <span>Tạm Tính</span>
          <span>{formatToVND(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-body-md-bold text-text-muted">
          <span>Phí Giao Hàng</span>
          <span>{formatToVND(deliveryFee)}</span>
        </div>
      </div>

      <CardFooter className="p-xl flex justify-between items-center">
        <span className="text-h3-bold text-text-primary">Tổng Cộng</span>
        <span className="text-h3-bold text-brand-primary">
          {formatToVND(total)}
        </span>
      </CardFooter>
    </Card>
  );
}
