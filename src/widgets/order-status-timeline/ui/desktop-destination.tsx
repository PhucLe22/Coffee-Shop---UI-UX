import { Order } from '@/entities/order';
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

interface DesktopDestinationProps {
  order?: Order;
}

export function DesktopDestination({ order }: DesktopDestinationProps) {
  const store = (order as any)?.store;
  const address = order?.address || (order?.customer as any)?.address;
  const customerName = (order as any)?.customer?.name;

  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardHeader>
        <CardTitle className="text-body-sm-reg text-text-secondary uppercase tracking-widest font-bold flex gap-sm items-center">
          <MapPin className="size-6 text-brand-primary" /> {address ? 'ĐIỂM ĐẾN' : 'CỬA HÀNG'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 w-full">
          {address ? (
            <p className="text-h4-bold text-text-primary w-full">{address}</p>
          ) : store ? (
            <div className="flex flex-col gap-sm">
              <p className="text-h4-bold text-text-primary">{store.name}</p>
              <p className="text-body-sm-reg text-text-secondary">{store.address}</p>
            </div>
          ) : (
            <p className="text-h4-bold text-text-muted w-full">Không có địa chỉ</p>
          )}
          {customerName && (
            <p className="text-body-sm-reg text-text-secondary mt-sm">
              Người nhận: {customerName}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
