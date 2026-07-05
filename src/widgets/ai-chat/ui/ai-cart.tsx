import { CartItem, FALLBACK_PRODUCT_IMAGE } from "../model/chat-store";
import Link from "next/link";

interface AICartProps {
  items: CartItem[];
  total: string;
}

export function AICart({ items, total }: AICartProps) {
  return (
    <div className="bg-surface-accent rounded-lg border border-text-primary/10 p-md flex flex-col gap-md">
      <div className="flex items-center justify-between border-b border-text-primary/10 pb-sm">
        <span className="text-body-sm-semibold text-text-secondary">
          Giỏ Hàng ({items.length} sản phẩm)
        </span>
        <span className="text-body-md-bold text-text-primary">
          Tổng: {total}
        </span>
      </div>
      <div className="flex flex-col gap-sm">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-md">
            <div className="size-10 rounded-md overflow-hidden bg-white shrink-0">
              <img
                src={item.image || FALLBACK_PRODUCT_IMAGE}
                alt={item.name}
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1 flex justify-between items-center">
              <span className="text-body-sm-reg text-text-primary">
                {item.name}
              </span>
              <span className="text-body-sm-semibold text-text-primary">
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/cart"
        className="w-full py-2 bg-brand-primary text-inverse-text rounded-full text-center text-body-sm-bold hover:bg-brand-primary/90 transition-colors mt-1">
        Thanh Toán Ngay
      </Link>
    </div>
  );
}
