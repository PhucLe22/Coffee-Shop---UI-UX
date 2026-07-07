import { Order } from '@/entities/order';
import { Card, CardContent } from '@/shared/ui/card';

interface DesktopEstimatedArrivalProps {
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

export function DesktopEstimatedArrival({ order }: DesktopEstimatedArrivalProps) {
  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardContent className="p-xl flex flex-col items-center justify-center gap-sm">
        <span className="text-body-sm-reg text-text-secondary uppercase tracking-widest font-bold">
          THỜI GIAN DỰ KIẾN
        </span>
        <span className="text-display-lg text-brand-primary leading-none">
          {formatEstimatedArrival(order.estimatedArrival)}
        </span>
      </CardContent>
    </Card>
  );
}
