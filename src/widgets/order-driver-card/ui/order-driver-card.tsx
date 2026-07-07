import { Phone } from 'lucide-react';
import { Order } from '@/entities/order';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { AppButton } from '@/shared/ui';

interface OrderDriverCardProps {
  order: Order;
}

export function OrderDriverCard({ order }: OrderDriverCardProps) {
  if (!order.driver) return null;

  return (
    <div className="bg-surface-accent rounded-md p-md shadow-lg flex items-center justify-between mx-md">
      <div className="flex items-center gap-md">
        <Avatar className="size-12 border-2 border-brand-accent/30">
          <AvatarImage src={order.driver.avatarUrl} />
          <AvatarFallback className="bg-surface-muted text-text-primary">
            {order.driver.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-body-md-bold text-text-primary leading-none">
            {order.driver.name}
          </span>
          <span className="text-caption-inter text-text-secondary">
Tài xế
          </span>
        </div>
      </div>
      
      <div className="flex gap-sm">
        <AppButton size="icon" variant="secondary" className="bg-surface-muted rounded-full shadow-none">
          <Phone className="size-4 text-text-secondary" />
        </AppButton>
        <AppButton variant="primary">
          Trung Tâm Hỗ Trợ
        </AppButton>
      </div>
    </div>
  );
}
