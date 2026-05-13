'use client';

import { useState } from 'react';
import { Leaf, Minus, Plus, ShoppingCart } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { AppButton } from '@/shared/ui';
import { SizeSelector, OptionButton, OptionCard } from '@/entities/product';

interface Product {
  name: string;
  category: string;
  description: string;
  basePrice: number;
  image: string;
  sizes: { id: string; label: string; volume: string; price: number }[];
  sweetness: string[];
  toppings: { id: number; name: string; description: string; price: number; selected: boolean }[];
}

interface DesktopProductDetailProps {
  product: Product;
}

export function DesktopProductDetail({ product }: DesktopProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0].id);
  const [selectedSweetness, setSelectedSweetness] = useState(product.sweetness[1]);
  const [toppings, setToppings] = useState(product.toppings);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = (id: number) => {
    setToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const totalPrice = (
    product.basePrice + 
    (product.sizes.find(s => s.id === selectedSize)?.price || 0) +
    toppings.filter(t => t.selected).reduce((acc, t) => acc + t.price, 0)
  ) * quantity;

  return (
    <div className="flex min-h-[calc(100vh-102px)] bg-surface-main">
      {/* Left Side: Image */}
      <div className="w-[50%] sticky top-[102px] h-[calc(100vh-102px)] overflow-hidden bg-surface-accent">
        <img 
          src={product.image} 
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
              <span className="text-body-sm-semibold uppercase tracking-wider">{product.category}</span>
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
              {product.sizes.map((size) => (
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
                {selectedSweetness} Honey Blend
              </span>
            </div>
            <div className="flex gap-sm overflow-x-auto no-scrollbar">
              {product.sweetness.map((level) => (
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

          {/* Milk Options */}
          <div className="flex flex-col gap-md">
            <h3 className="text-body-sm-reg text-text-primary/60 font-bold uppercase tracking-widest">
              MILK CHOICE
            </h3>
            <div className="grid grid-cols-4 gap-sm">
              {['Oat milk', 'Almond', 'Whole milk', 'Macadamia'].map((milk) => (
                <OptionButton
                  key={milk}
                  label={milk}
                  isSelected={milk === 'Oat milk'}
                  className="rounded-md h-[52px]"
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
                  ${totalPrice.toFixed(2)}
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
