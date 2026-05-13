import { Order } from '@/entities/order';
import { Card, CardContent } from '@/shared/ui/card';

interface DesktopEstimatedArrivalProps {
  order: Order;
}

export function DesktopEstimatedArrival({ order }: DesktopEstimatedArrivalProps) {
  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardContent className="p-xl flex flex-col items-center justify-center gap-sm">
        <span className="text-body-sm-reg text-text-secondary uppercase tracking-widest font-bold">
          ESTIMATED ARRIVAL
        </span>
        <span className="text-display-lg text-brand-primary leading-none">
          {order.estimatedArrival}
        </span>
        <span className="text-h5-bold text-text-secondary">
          {order.estimatedArrivalText}
        </span>
      </CardContent>
    </Card>
  );
}
