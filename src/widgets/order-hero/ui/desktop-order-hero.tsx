import { Order } from '@/entities/order';

interface DesktopOrderHeroProps {
  order: Order;
}

const statusMessages: Record<string, { title: string; desc: string }> = {
  NEW: { title: 'Đơn hàng đã được đặt', desc: 'Đơn hàng của bạn đang chờ xác nhận.' },
  CONFIRMED: { title: 'Đơn hàng đã được xác nhận', desc: 'Chúng tôi đang chuẩn bị nguyên liệu cho đơn hàng của bạn.' },
  PREPARING: { title: 'Đơn hàng đang được chuẩn bị', desc: 'Các nghệ nhân của chúng tôi đang tỉ mỉ pha chế đơn hàng của bạn.' },
  READY: { title: 'Đơn hàng đã sẵn sàng', desc: 'Đơn hàng của bạn đã sẵn sàng. Đang chờ được giao đến bạn.' },
  DELIVERING: { title: 'Đơn hàng đang được giao', desc: 'Tài xế đang trên đường giao đơn hàng đến bạn.' },
  COMPLETED: { title: 'Đơn hàng đã hoàn thành', desc: 'Cảm ơn bạn đã đặt hàng! Hy vọng bạn có trải nghiệm tuyệt vời.' },
  DELIVERED: { title: 'Đơn hàng đã hoàn thành', desc: 'Cảm ơn bạn đã đặt hàng! Hy vọng bạn có trải nghiệm tuyệt vời.' },
  CANCELLED: { title: 'Đơn hàng đã bị hủy', desc: 'Đơn hàng của bạn đã bị hủy.' },
};

export function DesktopOrderHero({ order }: DesktopOrderHeroProps) {
  const orderNumber = order.orderCode || order.id?.slice(0, 8).toUpperCase();
  const statusKey = (order.status as string) === 'on_the_way' ? 'DELIVERING' : (order.status as string) === 'delivered' ? 'DELIVERED' : (order.status as string);
  const msg = statusMessages[statusKey] || statusMessages.NEW;

  return (
    <section className="flex flex-col gap-md py-xl">
      <div className="flex items-center justify-between">
        <span className="text-h3-bold text-text-secondary uppercase tracking-wider">
          MÃ ĐƠN #{orderNumber}
        </span>
        <span className="text-body-sm-semibold text-text-muted">
          {(order as any).store?.name && `Từ: ${(order as any).store.name}`}
        </span>
      </div>
      <h1 className="text-display-lg text-text-primary leading-tight">
        {msg.title}
      </h1>
      <p className="text-body-lg-reg text-text-muted max-w-[800px]">
        {msg.desc}
      </p>
      {(order as any).customer?.name && (
        <p className="text-body-md-reg text-text-secondary">
          Khách hàng: {(order as any).customer.name} {(order as any).customer?.phone && `- ${(order as any).customer.phone}`}
        </p>
      )}
    </section>
  );
}
