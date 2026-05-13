import { Order, OrderStep, StatusStep } from '@/entities/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

interface OrderStatusTimelineProps {
  order: Order;
}

export function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  const steps: OrderStep[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      time: '12:10 PM',
      isCompleted: true,
      isActive: order.status === 'placed',
    },
    {
      status: 'preparing',
      label: 'Preparing',
      time: '12:15 PM',
      isCompleted: order.status === 'on_the_way' || order.status === 'delivered',
      isActive: order.status === 'preparing',
    },
    {
      status: 'on_the_way',
      label: 'Out for delivery',
      time: '12:20 PM',
      isCompleted: order.status === 'delivered',
      isActive: order.status === 'on_the_way',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      time: '1:00 PM',
      isCompleted: false,
      isActive: order.status === 'delivered',
    },
  ];

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
