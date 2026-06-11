'use client';

import { Minus, Plus } from 'lucide-react';
import { cn, formatToVND } from '@/shared/lib';
import { CartItem } from '@/entities/cart';

interface MobileCartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  className?: string;
}

export function MobileCartItem({
  item,
  onUpdateQuantity,
  className,
}: MobileCartItemProps) {
  return (
    <div
      className={cn(
        "flex h-32 w-full gap-md rounded-2xl bg-surface-muted p-md shadow-sm",
        className
      )}
    >
      {/* Product Image */}
      <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-stone-200">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-accent text-brand-primary/20">
            <span className="text-body-sm-bold font-plus-jakarta">IMG</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-md-bold font-plus-jakarta text-text-primary truncate">
            {item.name}
          </h3>
          <p className="text-body-sm-reg font-inter text-text-muted truncate">
            {item.options.map((opt) => opt.name).join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body-md-bold font-plus-jakarta text-brand-primary">
            {formatToVND(item.price * item.quantity)}
          </span>

          {/* Quantity Controls */}
          <div className="flex h-10 w-28 items-center justify-between rounded-full bg-surface-main px-4 border border-border-primary-50">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="flex size-4 items-center justify-center text-text-primary active:scale-125 transition-transform"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="text-body-sm-bold font-inter text-text-primary">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="flex size-4 items-center justify-center text-text-primary active:scale-125 transition-transform"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
