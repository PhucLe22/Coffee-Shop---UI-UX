import { Order } from '@/entities/order';
import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

interface DesktopDestinationProps {
  order?: Order;
}

export function DesktopDestination({ order }: DesktopDestinationProps) {
  const address = order?.address || (order?.customer as any)?.address || null;

  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardHeader>
        <CardTitle className="text-body-sm-reg text-text-secondary uppercase tracking-widest font-bold flex gap-sm items-center">
          <MapPin className="size-6 text-brand-primary" /> DESTINATION
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 w-full ">
          <p className="text-h4-bold text-text-primary w-full">
            {address || "No address available"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
