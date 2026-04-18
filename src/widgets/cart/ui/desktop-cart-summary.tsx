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
}

export function DesktopCartSummary({
  subtotal,
  shipping,
  tax,
  total,
  className,
  onCheckout,
  onApplyPromo,
}: DesktopCartSummaryProps) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-xl rounded-md bg-[#ebe0d9] p-xl",
        className,
      )}>
      <h3 className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
        Order Summary
      </h3>

      {/* Pricing Details */}
      <div className="flex flex-col gap-lg">
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Subtotal</span>
          <span className="text-text-muted">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Estimated Shipping</span>
          <span className="text-text-muted">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-[16px] font-normal font-inter text-text-primary leading-[19.36px]">
          <span>Tax</span>
          <span className="text-text-muted">${tax.toFixed(2)}</span>
        </div>
        <div className="h-[1px] bg-text-primary/50 my-md" />
        <div className="flex justify-between items-center">
          <span className="text-[20px] font-bold font-plus-jakarta text-text-muted leading-[25.2px]">
            Total
          </span>
          <span className="text-[24px] font-bold font-plus-jakarta text-text-primary leading-[30.24px]">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-md">
        <AppButton
          variant="primary"
          className="w-full h-[54px] rounded-[128px] bg-brand-primary"
          onClick={onCheckout}>
          CHECK OUT
        </AppButton>
        <p className="text-center text-[12px] font-medium font-inter text-text-primary leading-[16px]">
          Taxes and shipping calculated at checkout.
          <br />
          Secure SSL encrypted payment.
        </p>
      </div>

      {/* Promo Code */}
      <div className="flex flex-col gap-md border-t border-text-primary/50 pt-xl mt-md">
        <label className="text-[12px] font-bold font-plus-jakarta text-text-muted leading-[15.12px]">
          PROMO CODE
        </label>
        <div className="flex flex-col gap-md">
          <input
            type="text"
            placeholder="Enter code"
            className="h-[49px] w-full rounded-[8px] bg-[#faf2eb] px-md text-[14px] font-normal font-inter text-text-primary outline-none border border-transparent focus:border-brand-primary/20"
          />
          <AppButton variant="secondary" onClick={() => onApplyPromo("")}>
            APPLY
          </AppButton>
        </div>
      </div>
    </aside>
  );
}
