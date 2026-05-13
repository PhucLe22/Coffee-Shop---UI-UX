"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/shared/lib";
import { useCartStore, CartItem } from "@/entities/cart";

interface AddToCartProps {
  product: Omit<CartItem, 'quantity'>;
  className?: string;
}

const AddToCart = ({ product, className }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    addItem({ ...product, quantity });
  };

  return (
    <div
      className={cn(
        "flex h-auto w-full items-center bg-surface-accent px-4 py-4",
        className,
      )}>
      <div className="flex w-full items-center gap-4">
        {/* 113:300 - Quantity Selector Container */}
        <div className="flex items-center gap-4 rounded-md bg-surface-muted px-2 py-4">
          <button
            onClick={handleDecrement}
            className="flex items-center justify-center text-text-primary transition-opacity active:opacity-50">
            <Minus className="size-4" />
          </button>

          <span className="label-button-lg text-text-primary w-10 flex items-center justify-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="flex items-center justify-center text-text-primary transition-opacity active:opacity-50">
            <Plus className="size-4" />
          </button>
        </div>

        {/* 113:309 - Add to Cart Button */}
        <button
          onClick={handleAdd}
          className="flex h-auto py-4 px-4 w-full items-center justify-between rounded-md bg-brand-primary text-inverse-text">
          <span className="label-button-lg">Add to cart</span>
          <span className="text-body-md-bold">${product.price}</span>
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
