'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '@/entities/order';
import { 
  OrderHero, 
  DesktopOrderHero 
} from '@/widgets/order-hero';
import { 
  OrderStatusTimeline, 
  DesktopOrderStatusTimeline,
  DesktopEstimatedArrival,
  DesktopDestination
} from '@/widgets/order-status-timeline';
import { 
  OrderItemsSummary, 
  DesktopOrderSummary 
} from '@/widgets/order-items-summary';
import { 
  OrderDriverCard, 
  DesktopOrderDriverCard 
} from '@/widgets/order-driver-card';
import { Skeleton } from '@/shared/ui/skeleton';
import { useIsMobile } from '@/shared/lib';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const isMobile = useIsMobile();
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-lg p-md">
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-h3-bold text-text-primary">Order not found</span>
      </div>
    );
  }

  if (!isMobile) {
    return (
      <main className="min-h-screen bg-surface-main pb-3xl">
        <div className="container mx-auto px-2xl py-xl">
          <DesktopOrderHero order={order} />
          
          <div className="grid grid-cols-12 gap-xl mt-lg">
            {/* Left Column: Map, Driver, and Status */}
            <div className="col-span-7 flex flex-col gap-lg">
              <div className="h-[500px] bg-surface-muted rounded-lg relative overflow-hidden flex items-center justify-center border border-border-primary-50 shadow-smeffect">
                <div className="text-h3-bold text-text-muted">Live Tracking Map</div>
              </div>
              
              <DesktopOrderDriverCard order={order} />

              <DesktopOrderStatusTimeline order={order} />
            </div>

            {/* Right Column: Arrival, Destination, and Summary */}
            <div className="col-span-5 flex flex-col gap-lg">
              <DesktopEstimatedArrival order={order} />
              
              <DesktopDestination />

              <div className="sticky top-[120px]">
                <DesktopOrderSummary order={order} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-main pb-2xl flex flex-col">
      <OrderHero order={order} />

      <section className="flex flex-col gap-lg -mt-md">
        {/* Map Placeholder */}
        <div className="mx-md h-[450px] bg-surface-muted rounded-md relative overflow-hidden flex items-center justify-center">
          <div className="text-body-md-bold text-text-muted">Map goes here</div>
          
          {/* Driver Card Overlay */}
          <div className="absolute bottom-md left-0 right-0 z-20">
            <OrderDriverCard order={order} />
          </div>
        </div>

        <OrderStatusTimeline order={order} />
        
        <OrderItemsSummary order={order} />
      </section>
    </main>
  );
}
