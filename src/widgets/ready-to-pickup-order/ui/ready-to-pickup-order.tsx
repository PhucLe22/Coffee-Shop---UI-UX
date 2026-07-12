import { Order, useOrderByCode } from "@/entities/order";
import { Badge } from "@/shared/ui";
import { MapPin, Loader2 } from "lucide-react";
import { formatToVND } from "@/shared/lib";

interface ReadyToPickUpOrderProps {
  order: Order;
}

export const ReadyToPickUpOrder = ({ order }: ReadyToPickUpOrderProps) => {
  const { data: orderDetails, isLoading } = useOrderByCode(
    !order.items || order.items.length === 0 ? order.orderCode || null : null
  );

  const displayItems =
    order.items && order.items.length > 0
      ? order.items
      : orderDetails?.data.orderItems?.map((item, index) => ({
          id: `${index}`,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
        })) || [];

  const orderNumber = order.orderCode || order.id?.slice(0, 8).toUpperCase();

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-text-primary/10 bg-surface-muted p-8 shadow-sm min-h-[220px]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-text-primary" />
          <span className="text-[14px] font-bold font-plus-jakarta text-text-primary uppercase tracking-wide">
            MUA TẠI CỬA HÀNG
          </span>
        </div>
        <Badge className="h-[28px] rounded-full bg-[#10b981] px-4 text-[12px] font-bold text-inverse-text border-none shadow-sm">
          SẴN SÀNG
        </Badge>
      </div>

      <p className="mb-8 text-[12px] font-medium font-plus-jakarta text-text-muted opacity-80">
        Ordered {new Date(order.createdAt).toLocaleDateString()} • Order #{orderNumber}
      </p>

      {/* Item Card */}
      <div className="rounded-[20px] border border-text-primary/5 bg-surface-main p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[14px] font-medium font-plus-jakarta text-text-muted italic">
                <Loader2 className="size-3 animate-spin" />
                Đang tải...
              </div>
            ) : (
              <>
                <span className="text-[16px] font-bold font-plus-jakarta text-text-primary group-hover:text-brand-primary transition-colors truncate max-w-[200px]">
                  {displayItems[0]?.name || `Order from ${order.store?.name}`}
                </span>
                <span className="text-[12px] font-bold font-plus-jakarta text-text-muted uppercase tracking-wider opacity-70">
                  {displayItems[0]?.options?.map((o: any) => typeof o === 'string' ? o : o.name).join(", ") || "Gói Tiêu Chuẩn"}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-text-primary/5 pt-4 mt-2">
          <span className="text-[14px] font-bold font-plus-jakarta text-text-primary uppercase tracking-wide opacity-80">
            Tổng Cộng
          </span>
          <span className="text-[20px] font-extrabold font-plus-jakarta text-[#f0660a] leading-none">
            {formatToVND(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
};
