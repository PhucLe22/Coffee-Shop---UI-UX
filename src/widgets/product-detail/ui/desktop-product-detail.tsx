'use client';

import { useState } from 'react';
import { Leaf, Minus, Plus, ShoppingCart } from 'lucide-react';
import { cn, formatToVND } from '@/shared/lib';
import { AppButton } from '@/shared/ui';
import { SizeSelector, OptionButton, OptionCard, Product } from '@/entities/product';

interface DesktopProductDetailProps {
  product: Product;
}

// UI-only defaults until backend supports these
const MOCK_SIZES = [
  { id: "s", label: "Standard", volume: "12oz", price: 0 },
  { id: "m", label: "Medium", volume: "16oz", price: 15000 },
  { id: "l", label: "Large", volume: "20oz", price: 25000 },
];

const MOCK_SWEETNESS = ["None", "25%", "50%", "75%", "100%"];

const MOCK_TOPPINGS = [
  { id: 1, name: "Cold Foam Head", description: "Signature silky texture", price: 5000, selected: false },
  { id: 2, name: "Extra Maldon Salt", description: "For the bold palate", price: 2000, selected: false },
];

export function DesktopProductDetail({ product }: DesktopProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState(MOCK_SIZES[1].id);
  const [selectedSweetness, setSelectedSweetness] = useState(MOCK_SWEETNESS[1]);
  const [toppings, setToppings] = useState(MOCK_TOPPINGS);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = (id: number) => {
    setToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const selectedSizeData = MOCK_SIZES.find(s => s.id === selectedSize);
  
  const totalPrice = (
    product.basePrice + 
    (selectedSizeData?.price || 0) +
    toppings.filter(t => t.selected).reduce((acc, t) => acc + t.price, 0)
  ) * quantity;

  return (
    <div className="flex min-h-[calc(100vh-102px)] bg-surface-main">
      {/* Left Side: Image */}
      <div className="w-[50%] sticky top-[102px] h-[calc(100vh-102px)] overflow-hidden bg-surface-accent">
        <img 
          src={product.thumbnail || "/placeholder-product.jpg"} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side: Customization */}
      <div className="w-[50%] p-2xl overflow-y-auto no-scrollbar bg-surface-main">
        <div className="max-w-[512px] flex flex-col gap-xl">
          {/* Header */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-sm text-text-secondary">
              <Leaf className="size-4 fill-text-secondary" />
              <span className="text-body-sm-semibold uppercase tracking-wider">{product.category.name}</span>
            </div>
            <h1 className="text-display-md text-text-primary leading-tight">
              {product.name}
            </h1>
            <p className="text-body-lg-reg text-text-muted">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-md">
            <h3 className="text-body-sm-reg text-text-primary/60 font-bold uppercase tracking-widest">
              CHOOSE SIZE
            </h3>
            <div className="flex gap-md">
              {MOCK_SIZES.map((size) => (
                <SizeSelector
                  key={size.id}
                  label={size.label}
                  volume={size.volume}
                  isActive={selectedSize === size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className="h-[83px] rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Sweetness */}
          <div className="flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h3 className="text-body-sm-reg text-text-primary/60 font-bold uppercase tracking-widest">
                SWEETNESS LEVEL
              </h3>
              <span className="text-body-sm-semibold text-text-secondary">
                {selectedSweetness} Sugar Level
              </span>
            </div>
            <div className="flex gap-sm overflow-x-auto no-scrollbar">
              {MOCK_SWEETNESS.map((level) => (
                <OptionButton
                  key={level}
                  label={level}
                  isSelected={selectedSweetness === level}
                  onClick={() => setSelectedSweetness(level)}
                  className="rounded-md h-[52px] min-w-[120px]"
                />
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div className="flex flex-col gap-md">
            <h3 className="text-body-sm-reg text-text-primary/60 font-bold uppercase tracking-widest">
              ELEVATE YOUR BREW
            </h3>
            <div className="flex flex-col gap-sm">
              {toppings.map((topping) => (
                <OptionCard
                  key={topping.id}
                  name={topping.name}
                  price={topping.price}
                  isSelected={topping.selected}
                  onToggle={() => toggleTopping(topping.id)}
                  className="rounded-md border-border-primary-50"
                />
              ))}
            </div>
          </div>

          {/* Summary & CTA */}
          <div className="flex flex-col gap-lg pt-xl border-t border-border-primary-50">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-body-sm-semibold text-text-muted uppercase tracking-widest">
                  TOTAL AMOUNT
                </span>
                <span className="text-display-md text-text-secondary leading-none">
                  {formatToVND(totalPrice)}
                </span>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-md bg-surface-muted rounded-full px-lg h-14 border border-border-primary-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-text-primary hover:text-brand-primary"
                >
                  <Minus className="size-4" />
                </button>
                <span className="text-h4-bold min-w-[20px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-text-primary hover:text-brand-primary"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <AppButton variant="primary" className="w-full h-14 gap-md">
              <ShoppingCart className="size-6" />
              ADD TO CART
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
