import { Order, OrderStep, OrderActivity, StatusStep } from '@/entities/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

interface OrderStatusTimelineProps {
  order: Order;
  activities?: OrderActivity[];
}

function formatTime(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function buildSteps(order: Order, activities?: OrderActivity[]): OrderStep[] {
  if (activities && activities.length > 0) {
    return activities.map((a) => ({
      status: a.status.toLowerCase() as any,
      label: a.label,
      time: a.isEstimate
        ? `Estimated ${formatTime(a.time)}`
        : formatTime(a.time),
      isCompleted: a.isPast,
      isActive: !a.isPast && !a.isEstimate,
    }));
  }
  return [
    { status: 'placed', label: 'Order Placed', time: '12:10 PM', isCompleted: true, isActive: order.status === 'placed' },
    { status: 'preparing', label: 'Preparing', time: '12:15 PM', isCompleted: order.status === 'on_the_way' || order.status === 'delivered', isActive: order.status === 'preparing' },
    { status: 'on_the_way', label: 'Out for delivery', time: '12:20 PM', isCompleted: order.status === 'delivered', isActive: order.status === 'on_the_way' },
    { status: 'delivered', label: 'Delivered', time: '1:00 PM', isCompleted: false, isActive: order.status === 'delivered' },
  ];
}

export function OrderStatusTimeline({ order, activities }: OrderStatusTimelineProps) {
  const steps = buildSteps(order, activities);

  return (
    <Card className="bg-surface-muted border-none shadow-none rounded-md mx-md">
      <CardHeader className="p-md">
        <CardTitle className="text-h3-bold text-text-primary">
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-md pt-0">
        <div className="flex flex-col">
          {steps.map((step, index) => (
            <StatusStep 
              key={step.status} 
              step={step} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
