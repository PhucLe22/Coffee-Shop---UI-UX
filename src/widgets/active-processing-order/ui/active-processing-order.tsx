import { Order, useOrderByCode } from "@/entities/order";
import { Badge, AppButton } from "@/shared/ui";
import { Clock, Loader2 } from "lucide-react";
import { formatToVND } from "@/shared/lib";

interface ActiveProcessingOrderProps {
  order: Order;
}

export const ActiveProcessingOrder = ({ order }: ActiveProcessingOrderProps) => {
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-text-primary/10 bg-[#ebe0d9] p-10 shadow-sm relative">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="rounded-md bg-surface-main px-4 py-2 border border-text-primary/5 shadow-inner">
            <span className="text-[14px] font-bold font-plus-jakarta text-text-primary uppercase tracking-wide">
              ORDER #{orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Clock className="size-4" />
            <span className="text-[12px] font-medium font-plus-jakarta">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <Badge className="h-[30px] rounded-full bg-[#3b82f6] px-5 text-[12px] font-bold text-inverse-text border-none shadow-sm">
          ĐANG CHUẨN BỊ
        </Badge>
      </div>

      {/* Content */}
      <div className="flex gap-10 mb-10 items-start">
        <div className="size-[200px] shrink-0 overflow-hidden rounded-2xl border border-text-primary/10 bg-white/10 shadow-md">
          <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary font-bold text-6xl">
            {order.store.name.charAt(0)}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="flex items-center gap-2 text-text-muted italic">
                <Loader2 className="size-4 animate-spin" />
                Đang tải chi tiết sản phẩm...
              </div>
            ) : displayItems.length > 0 ? (
              displayItems.slice(0, 2).map((item: any) => (
                <div key={item.id} className="flex items-start justify-between group">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-[14px] font-medium font-inter text-text-muted italic opacity-80">
                      {item.options?.join(", ") || "Regular"}
                    </p>
                  </div>
                  <span className="text-[18px] font-bold font-plus-jakarta text-text-primary">
                    {formatToVND(item.price)}đ
                  </span>
                </div>
              ))
            ) : (
              <div className="text-text-muted italic text-lg">
                Chi tiết sản phẩm không khả dụng trong danh sách này.
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-text-primary/10 mt-auto">
            <span className="text-[20px] font-bold font-plus-jakarta text-text-primary">
              Total:
            </span>
            <span className="text-[48px] font-extrabold font-plus-jakarta text-[#f0660a] leading-none tracking-tighter">
              {formatToVND(order.total)}đ
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t border-text-primary/10 flex justify-end">
        <AppButton 
          variant="secondary" 
          className="px-12 h-14 rounded-full font-bold text-[16px] shadow-md hover:shadow-lg hover:bg-surface-inverse hover:text-inverse-text transition-all active:scale-95"
        >
          THEO DÕI ĐƠN HÀNG
        </AppButton>
      </div>
    </div>
  );
};
