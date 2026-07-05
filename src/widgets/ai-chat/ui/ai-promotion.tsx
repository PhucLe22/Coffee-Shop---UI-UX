import { PromotionVoucher } from "../model/chat-store";
import { Tag } from "lucide-react";

interface AIPromotionProps {
  vouchers: PromotionVoucher[];
}

function formatDiscount(v: PromotionVoucher) {
  if (v.discountType === "PERCENT") {
    const text = `Giảm ${v.discountValue}%`;
    return v.maxDiscount ? `${text} (tối đa ${v.maxDiscount.toLocaleString()}đ)` : text;
  }
  return `Giảm ${v.discountValue.toLocaleString()}đ`;
}

function formatExpiry(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return `HSD: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  } catch {
    return "";
  }
}

export function AIPromotion({ vouchers }: AIPromotionProps) {
  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="bg-surface-accent rounded-lg border border-text-primary/10 p-md">
        <p className="text-body-sm-reg text-text-muted">Hiện không có chương trình khuyến mãi nào.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {vouchers.map((v, idx) => (
        <div key={idx} className="bg-surface-accent rounded-lg border border-text-primary/10 p-md flex items-start gap-md">
          <div className="size-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Tag size={18} className="text-brand-primary" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-body-sm-bold text-text-primary uppercase tracking-wider">{v.code}</span>
            <span className="text-body-sm-reg text-brand-primary font-semibold">{formatDiscount(v)}</span>
            {v.minOrderAmount != null && v.minOrderAmount > 0 && (
              <span className="text-overline-inter text-text-muted">Đơn tối thiểu: {v.minOrderAmount.toLocaleString()}đ</span>
            )}
            {v.expiresAt && (
              <span className="text-overline-inter text-text-muted">{formatExpiry(v.expiresAt)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
