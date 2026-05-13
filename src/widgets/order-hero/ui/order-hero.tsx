import { Order } from '@/entities/order';

interface OrderHeroProps {
  order: Order;
}

export function OrderHero({ order }: OrderHeroProps) {
  return (
    <section className="flex flex-col gap-lg px-md pt-lg pb-md">
      <div className="flex flex-col gap-xs">
        <span className="text-body-sm-semibold text-text-secondary uppercase">
          ORDER #{order.orderNumber}
        </span>
        <h1 className="text-h1-bold text-text-primary">
          {order.status === 'on_the_way' ? 'On its way.' : 'Your order is being prepared.'}
        </h1>
      </div>
      
      <div className="bg-surface-muted rounded-md p-md flex flex-col items-center justify-center gap-xs">
        <span className="text-overline-inter text-text-secondary uppercase font-bold">
          ESTIMATED ARRIVAL
        </span>
        <span className="text-display-lg text-brand-primary">
          {order.estimatedArrival}
        </span>
        <span className="text-body-sm-semibold text-text-secondary">
          {order.estimatedArrivalText}
        </span>
      </div>
    </section>
  );
}
