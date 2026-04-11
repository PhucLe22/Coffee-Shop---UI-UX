import { Check, Bike, Ellipsis, MapPin } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Order, OrderStep } from '@/entities/order';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

interface DesktopOrderStatusTimelineProps {
  order: Order;
}

export function DesktopOrderStatusTimeline({ order }: DesktopOrderStatusTimelineProps) {
  const steps: OrderStep[] = [
    {
      status: 'placed',
      label: 'Order Placed',
      time: '10:15 AM • Your order has been acknowledged by the collective.',
      isCompleted: true,
      isActive: order.status === 'placed',
    },
    {
      status: 'preparing',
      label: 'Preparing',
      time: '10:20 AM • Our artisans are meticulously crafting your ritual.',
      isCompleted: order.status === 'on_the_way' || order.status === 'delivered',
      isActive: order.status === 'preparing',
    },
    {
      status: 'on_the_way',
      label: 'Out for delivery',
      time: '10:45 AM • Your courier is navigating the city to your doorstep.',
      isCompleted: order.status === 'delivered',
      isActive: order.status === 'on_the_way',
    },
    {
      status: 'delivered',
      label: 'Delivered',
      time: 'Estimated 11:15 AM • The warmth has arrived.',
      isCompleted: false,
      isActive: order.status === 'delivered',
    },
  ];

  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardHeader className="p-xl pb-md">
        <CardTitle className="text-h3-bold text-text-primary">
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-xl pt-0">
        <div className="flex flex-col relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-2 bottom-8 w-[2px] bg-text-muted/30" />
          
          <div className="flex flex-col gap-lg">
            {steps.map((step) => {
              const Icon = step.status === 'on_the_way' ? Bike : 
                           step.status === 'delivered' ? MapPin :
                           step.status === 'preparing' ? Ellipsis : Check;
              
              return (
                <div key={step.status} className="flex gap-xl relative z-10">
                  <div className={cn(
                    "size-10 rounded-full flex items-center justify-center transition-colors",
                    step.isActive ? "bg-brand-primary" : step.isCompleted ? "bg-text-secondary" : "bg-surface-muted"
                  )}>
                    <Icon className={cn(
                      "size-5",
                      step.isActive || step.isCompleted ? "text-text-inverse" : "text-text-muted"
                    )} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className={cn(
                      "text-h4-bold leading-none",
                      step.isActive ? "text-text-primary" : "text-text-muted"
                    )}>
                      {step.label}
                    </h4>
                    <span className="text-body-sm-reg text-text-muted">
                      {step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
