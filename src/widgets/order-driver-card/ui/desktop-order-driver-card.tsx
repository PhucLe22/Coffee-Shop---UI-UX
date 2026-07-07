import { Phone } from 'lucide-react';
import { Order } from '@/entities/order';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { AppButton } from '@/shared/ui';

interface DesktopOrderDriverCardProps {
  order: Order;
}

export function DesktopOrderDriverCard({ order }: DesktopOrderDriverCardProps) {
  if (!order.driver) return null;

  return (
    <div className="bg-surface-accent rounded-md p-md shadow-lg flex items-center justify-between border border-border-primary-50">
      <div className="flex items-center gap-md">
        <Avatar className="size-14 border-2 border-brand-accent/30">
          <AvatarImage src={order.driver.avatarUrl} />
          <AvatarFallback className="bg-surface-muted text-text-primary text-h4-bold">
            {order.driver.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-h4-bold text-text-primary">
            {order.driver.name}
          </span>
          <span className="text-body-sm-reg text-text-muted">
            Tài xế giao hàng của bạn
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-md">
        <AppButton 
          size="icon" 
          variant="secondary" 
          className="size-14 rounded-full bg-text-secondary hover:bg-text-secondary/90 shadow-none"
        >
          <Phone className="size-6 text-inverse-text" />
        </AppButton>
        <AppButton variant="primary" className="h-14 px-xl label-button-md">
          TRUNG TÂM HỖ TRỢ
        </AppButton>
      </div>
    </div>
  );
}
