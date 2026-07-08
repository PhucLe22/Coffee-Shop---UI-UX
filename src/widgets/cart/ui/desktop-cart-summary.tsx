"use client";

import { useState } from "react";
import { AppButton } from "@/shared/ui";
import { cn, formatToVND } from "@/shared/lib";
import type { SuggestVoucherItem } from "@/entities/voucher";

interface DesktopCartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  className?: string;
  onCheckout: () => void;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
  isLoading?: boolean;
  isValidatingPromo?: boolean;
  appliedVoucherCode?: string;
  voucherError?: string;
  suggestedVouchers?: SuggestVoucherItem[];
  isSuggestingVouchers?: boolean;
}

export function DesktopCartSummary({
  subtotal,
  shipping,
  tax,
  discount,
  total,
  className,
  onCheckout,
  onApplyPromo,
  onRemovePromo,
  isLoading,
  isValidatingPromo,
  appliedVoucherCode,
  voucherError,
  suggestedVouchers,
  isSuggestingVouchers,
}: DesktopCartSummaryProps) {
  const [promoInput, setPromoInput] = useState("");

  const handleApply = () => {
    onApplyPromo(promoInput);
  };

  const handleApplySuggested = (code: string) => {
    onApplyPromo(code);
  };

  const handleRemove = () => {
    setPromoInput("");
    onRemovePromo();
  };

  return (
    <aside
      className={cn(
        "flex flex-col gap-xl rounded-md bg-surface-muted p-xl",
        className,
      )}>
      <h3 className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
        Tóm tắt đơn hàng
      </h3>

      <div className="flex flex-col gap-lg">
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Tạm tính</span>
          <span className="text-text-muted">{formatToVND(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Phí giao hàng</span>
          <span className="text-text-muted">{formatToVND(shipping)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Thuế (8% VAT)</span>
          <span className="text-text-muted">{formatToVND(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-[16px] font-normal font-inter text-success leading-[19.36px]">
            <span>Giảm giá</span>
            <span>-{formatToVND(discount)}</span>
          </div>
        )}
        <div className="h-[1px] bg-text-primary/50 my-md" />
        <div className="flex justify-between items-center">
          <span className="text-[20px] font-bold font-plus-jakarta text-text-muted leading-[25.2px]">
            Tổng cộng
          </span>
          <span className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
            {formatToVND(total)}
          </span>
        </div>
      </div>

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

      <div className="flex flex-col gap-md border-t border-text-primary/50 pt-xl mt-md">
        <label className="text-[12px] font-bold font-plus-jakarta text-text-muted leading-[15.12px]">
          MÃ KHUYẾN MÃI
        </label>
        {appliedVoucherCode ? (
          <div className="flex items-center justify-between bg-success/20 rounded-[8px] px-md py-sm border border-success/20">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-success">{appliedVoucherCode}</span>
              <span className="text-[12px] text-success">Đã áp dụng</span>
            </div>
            <button
              onClick={handleRemove}
              className="text-[12px] font-bold text-red-500 hover:underline"
            >
              HỦY
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            <input
              type="text"
              placeholder="Nhập mã"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="h-[49px] w-full rounded-[8px] bg-surface-accent px-md text-[14px] font-normal font-inter text-text-primary outline-none border border-transparent focus:border-brand-primary/20"
            />
            {voucherError && (
              <span className="text-[12px] text-red-500">{voucherError}</span>
            )}
            <AppButton
              variant="secondary"
              onClick={handleApply}
              isLoading={isValidatingPromo}
            >
              ÁP DỤNG
            </AppButton>
          </div>
        )}

        {suggestedVouchers && suggestedVouchers.length > 0 && !appliedVoucherCode && (
          <div className="flex flex-col gap-sm mt-md">
            <label className="text-[11px] font-bold font-plus-jakarta text-text-muted leading-[13.86px]">
              GỢI Ý CHO BẠN
            </label>
            <div className="flex flex-col gap-sm">
              {suggestedVouchers.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleApplySuggested(v.code)}
                  className="flex items-center justify-between bg-surface-accent hover:bg-brand-primary/10 rounded-[8px] px-md py-sm border border-border-primary-50 transition-colors text-left w-full"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-text-primary">{v.code}</span>
                    <span className="text-[11px] text-text-muted">
                      {v.discountType === "FIXED"
                        ? `Giảm ${formatToVND(Number(v.discountValue))}`
                        : `Giảm ${v.discountValue}%${v.maxDiscount ? ` (tối đa ${formatToVND(Number(v.maxDiscount))})` : ""}`}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-brand-primary whitespace-nowrap">
                    -{formatToVND(v.estimatedDiscount)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
