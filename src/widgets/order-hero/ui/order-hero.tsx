import { Order } from '@/entities/order';

interface OrderHeroProps {
  order: Order;
}

function formatEstimatedArrival(iso: string | undefined): string {
  if (!iso) return "--:--";
  try {
    return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

const statusMessages: Record<string, string> = {
  NEW: 'Đơn hàng đã được đặt',
  CONFIRMED: 'Đơn hàng đã được xác nhận',
  PREPARING: 'Đơn hàng đang được chuẩn bị',
  READY: 'Đơn hàng đã sẵn sàng',
  DELIVERING: 'Đơn hàng đang được giao',
  COMPLETED: 'Đơn hàng đã hoàn thành',
  DELIVERED: 'Đơn hàng đã hoàn thành',
  CANCELLED: 'Đơn hàng đã bị hủy',
};

export function OrderHero({ order }: OrderHeroProps) {
  const orderNumber = order.orderCode || order.id?.slice(0, 8).toUpperCase();
  const statusKey = (order.status as string) === 'on_the_way' ? 'DELIVERING' : (order.status as string) === 'delivered' ? 'DELIVERED' : (order.status as string);
  const title = statusMessages[statusKey] || statusMessages.NEW;

  return (
    <section className="flex flex-col gap-lg px-md pt-lg pb-md">
      <div className="flex flex-col gap-xs">
        <span className="text-body-sm-semibold text-text-secondary uppercase">
          MÃ ĐƠN #{orderNumber}
        </span>
        {(order as any).store?.name && (
          <span className="text-body-sm-reg text-text-muted">
            {(order as any).store.name}
          </span>
        )}
        <h1 className="text-h1-bold text-text-primary">
          {title}
        </h1>
      </div>
      <div className="bg-surface-muted rounded-md p-md flex flex-col items-center justify-center gap-xs">
        <span className="text-overline-inter text-text-secondary uppercase font-bold">
          THỜI GIAN DỰ KIẾN
        </span>
        <span className="text-display-lg text-brand-primary">
          {formatEstimatedArrival(order.estimatedArrival)}
        </span>
      </div>
    </section>
  );
}
