"use client";

import { Minus, Plus } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { CartItem } from "@/entities/cart";

interface DesktopCartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function DesktopCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}: DesktopCartItemProps) {
  return (
    <div
      className={cn(
        "flex h-[240px] w-full gap-xl rounded-md bg-[#ebe0d9] p-xl border border-[#ebe0d9]",
        className
      )}
    >
      {/* Product Image */}
      <div className="h-[192px] w-[192px] shrink-0 overflow-hidden rounded-sm bg-surface-accent">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-primary/20">
            <span className="text-h2-bold">IMG</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-xs">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-xs">
              <h3 className="text-[20px] font-bold font-plus-jakarta text-text-primary leading-[25.2px]">
                {item.name}
              </h3>
              <p className="text-[14px] font-normal font-inter text-text-primary leading-[16.94px]">
                {item.options}
              </p>
            </div>
            <span className="text-[18px] font-bold font-plus-jakarta text-brand-primary leading-[22.68px]">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.origin && (
            <div className="flex items-center gap-2 mt-sm">
              <span className="text-[12px] font-bold font-plus-jakarta text-text-secondary leading-[15.12px]">
                {item.origin}
              </span>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Controls */}
          <div className="flex h-[56px] w-[150.77px] items-center justify-between rounded-[128px] bg-[#faf2eb] px-xl border border-border-primary-50">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="flex size-4 items-center justify-center text-text-primary hover:text-brand-primary transition-colors"
            >
              <Minus className="size-4" />
            </button>
            <span className="text-[16px] font-bold font-inter text-text-primary leading-[19.36px]">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="flex size-4 items-center justify-center text-text-primary hover:text-brand-primary transition-colors"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(item.id)}
            className="flex items-center justify-center px-xl h-[54.4px] rounded-[128px] text-[16px] font-bold font-inter text-error hover:bg-error/10 transition-all active:scale-95"
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
