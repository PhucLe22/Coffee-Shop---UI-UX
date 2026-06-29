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

export function OrderHero({ order }: OrderHeroProps) {
  const orderNumber = order.orderCode || order.id?.slice(0, 8).toUpperCase();

  return (
    <section className="flex flex-col gap-lg px-md pt-lg pb-md">
      <div className="flex flex-col gap-xs">
        <span className="text-body-sm-semibold text-text-secondary uppercase">
          ORDER #{orderNumber}
        </span>
        <h1 className="text-h1-bold text-text-primary">
          {(order.status as string) === 'on_the_way' || (order.status as string) === 'DELIVERED' 
            ? 'On its way.' 
            : 'Your order is being prepared.'}
        </h1>
      </div>
      <div className="bg-surface-muted rounded-md p-md flex flex-col items-center justify-center gap-xs">
        <span className="text-overline-inter text-text-secondary uppercase font-bold">
          ESTIMATED ARRIVAL
        </span>
        <span className="text-display-lg text-brand-primary">
          {formatEstimatedArrival(order.estimatedArrival)}
        </span>
      </div>
    </section>
  );
}
