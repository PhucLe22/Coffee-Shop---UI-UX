import { Order } from '@/entities/order';

interface DesktopOrderHeroProps {
  order: Order;
}

export function DesktopOrderHero({ order }: DesktopOrderHeroProps) {
  return (
    <section className="flex flex-col gap-md py-xl">
      <span className="text-h3-bold text-text-secondary uppercase tracking-wider">
        CURRENT ORDER #{order.orderNumber}
      </span>
      <h1 className="text-display-lg text-text-primary leading-tight">
        {order.status === 'on_the_way' ? 'Your Ritual is En Route' : 'Your order is being prepared.'}
      </h1>
      <p className="text-body-lg-reg text-text-muted max-w-[800px]">
        We&apos;ve meticulously prepared your beans. Your courier is currently navigating the city to bring the warmth to your doorstep.
      </p>
    </section>
  );
}
