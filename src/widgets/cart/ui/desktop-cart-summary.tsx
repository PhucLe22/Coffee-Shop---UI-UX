"use client";

import { AppButton } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface DesktopCartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  className?: string;
  onCheckout: () => void;
  onApplyPromo: (code: string) => void;
  isLoading?: boolean;
}

export function DesktopCartSummary({
  subtotal,
  shipping,
  tax,
  total,
  className,
  onCheckout,
  onApplyPromo,
  isLoading,
}: DesktopCartSummaryProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-xl rounded-md bg-[#ebe0d9] p-xl",
        className,
      )}>
      <h3 className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
        Tóm tắt đơn hàng
      </h3>

      {/* Pricing Details */}
      <div className="flex flex-col gap-lg">
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Tạm tính</span>
          <span className="text-text-muted">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Phí giao hàng</span>
          <span className="text-text-muted">{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Thuế (8% VAT)</span>
          <span className="text-text-muted">{formatCurrency(tax)}</span>
        </div>
        <div className="h-[1px] bg-text-primary/50 my-md" />
        <div className="flex justify-between items-center">
          <span className="text-[20px] font-bold font-plus-jakarta text-text-muted leading-[25.2px]">
            Tổng cộng
          </span>
          <span className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-md">
        <AppButton
          variant="primary"
          className="w-full h-[54px] rounded-[128px] bg-brand-primary text-inverse-text"
          onClick={onCheckout}
          isLoading={isLoading}
        >
          THANH TOÁN NGAY
        </AppButton>
        <p className="text-center text-[12px] font-medium font-inter text-text-primary leading-[16px]">
          Giá đã bao gồm thuế và phí.
          <br />
          Thanh toán an toàn qua SSL.
        </p>
      </div>

      {/* Promo Code */}
      <div className="flex flex-col gap-md border-t border-text-primary/50 pt-xl mt-md">
        <label className="text-[12px] font-bold font-plus-jakarta text-text-muted leading-[15.12px]">
          MÃ KHUYẾN MÃI
        </label>
        <div className="flex flex-col gap-md">
          <input
            type="text"
            placeholder="Nhập mã"
            className="h-[49px] w-full rounded-[8px] bg-[#faf2eb] px-md text-[14px] font-normal font-inter text-text-primary outline-none border border-transparent focus:border-brand-primary/20"
          />
          <AppButton variant="secondary" onClick={() => onApplyPromo("")}>
            ÁP DỤNG
          </AppButton>
        </div>
      </div>
    </aside>
  );
}
