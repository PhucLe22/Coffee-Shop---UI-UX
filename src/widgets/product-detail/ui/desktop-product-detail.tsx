'use client';

import { useState } from 'react';
import { Leaf, Minus, Plus, ShoppingCart } from 'lucide-react';
import { cn, formatToVND } from '@/shared/lib';
import { AppButton } from '@/shared/ui';
import { SizeSelector, OptionButton, OptionCard, Product } from '@/entities/product';
import { useCartStore } from '@/entities/cart';
import { toast } from 'sonner';

const getDefaultOptionId = (group: { name: string; options: { id: string; name: string }[] }, isRequired: boolean): string | undefined => {
  const name = group.name.toLowerCase();
  const opts = group.options;
  if (opts.length === 0) return undefined;

  if (name.includes('size')) {
    return opts.find(o => o.name === 'M' || o.name.startsWith('M ') || o.name.includes('(M)'))?.id
      || opts.find(o => o.name === 'L' || o.name.startsWith('L '))?.id
      || opts[0].id;
  }
  if (name.includes('ngọt') || name.includes('sugar')) {
    return opts.find(o => o.name.includes('100%'))?.id
      || opts[0].id;
  }
  if (name.includes('đá') || name.includes('ice')) {
    return opts.find(o => o.name.toLowerCase().includes('thường'))?.id
      || opts[0].id;
  }

  if (isRequired) return opts[0].id;
  return undefined;
};

interface DesktopProductDetailProps {
  product: Product;
}

export function DesktopProductDetail({ product }: DesktopProductDetailProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    product.optionGroups?.forEach(group => {
      if (group.options.length > 0) {
        const defaultId = getDefaultOptionId(group, group.isRequired);
        initial[group.id] = defaultId ? [defaultId] : [];
      } else {
        initial[group.id] = [];
      }
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);

  const toggleOption = (groupId: string, optionId: string, isMultiple: boolean) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] || [];
      if (isMultiple) {
        return {
          ...prev,
          [groupId]: current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId],
        };
      } else {
        return {
          ...prev,
          [groupId]: [optionId],
        };
      }
    });
  };

  const getSelectedOptionsFormatted = () => {
    const formatted: { optionId: string; name: string; price: number }[] = [];
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = product.optionGroups?.find((g) => g.id === groupId);
      if (group) {
        optionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) {
            formatted.push({
              optionId: option.id,
              name: option.name,
              price: Number(option.price || 0),
            });
          }
        });
      }
    });
    return formatted;
  };

  const handleAddToCart = () => {
    const formattedOptions = getSelectedOptionsFormatted();
    const extraPrice = formattedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const itemPrice = Number(product.basePrice) + extraPrice;
    
    const cartId = `${product.id}-${formattedOptions.map(o => o.optionId).sort().join('-')}`;
    
    addItem({
      id: cartId,
      productId: product.id,
      name: product.name,
      price: itemPrice,
      quantity,
      imageUrl: product.thumbnail || undefined,
      options: formattedOptions,
    });
    
    toast.success("Đã thêm vào giỏ hàng");
  };

  const calculateTotalPrice = () => {
    const formattedOptions = getSelectedOptionsFormatted();
    const extraPrice = formattedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (Number(product.basePrice) + extraPrice) * quantity;
  };

  const totalPrice = calculateTotalPrice();

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
        <div className="w-full flex flex-col gap-xl">
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

          {/* Dynamic Option Groups */}
          {product.optionGroups?.sort((a, b) => a.sortOrder - b.sortOrder).map((group) => (
            <div key={group.id} className="flex flex-col gap-md">
              <div className="flex justify-between items-center">
                <h3 className="text-body-sm-reg text-text-primary/60 font-bold uppercase tracking-widest">
                  {({ 'Sugar Level': 'Độ ngọt', 'Ice Level': 'Lượng đá' } as Record<string, string>)[group.name] || group.name}
                </h3>
              </div>

              {group.isMultiple && group.name.toLowerCase().includes('topping') && (
                <span className="text-body-sm-reg text-text-muted">
                  Chọn tối đa {group.options.length} loại Topping
                </span>
              )}

              {group.isMultiple ? (
                <div className="flex flex-col gap-sm">
                  {group.options.sort((a, b) => a.sortOrder - b.sortOrder).map((option) => (
                    <OptionCard
                      key={option.id}
                      name={option.name}
                      price={Number(option.price || 0)}
                      isSelected={selectedOptions[group.id]?.includes(option.id)}
                      onToggle={() => toggleOption(group.id, option.id, true)}
                      className="rounded-md border-border-primary-50"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 flex-wrap">
                  {group.options.sort((a, b) => a.sortOrder - b.sortOrder).map((option) => {
                    // Check if it's a size group by name (heuristic)
                    const isSizeGroup = group.name.toLowerCase().includes('size');
                    
                    if (isSizeGroup) {
                      return (
                        <SizeSelector
                          key={option.id}
                          label={option.name}
                          volume="" // volume not available in backend yet
                          isActive={selectedOptions[group.id]?.includes(option.id)}
                          onClick={() => toggleOption(group.id, option.id, false)}
                          className="h-[56px] rounded-md"
                        />
                      );
                    }

                    return (
                      <OptionButton
                        key={option.id}
                        label={option.name}
                        isSelected={selectedOptions[group.id]?.includes(option.id)}
                        onClick={() => toggleOption(group.id, option.id, false)}
                        className="rounded-md h-[52px]"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* Summary & CTA */}
          <div className="flex flex-col gap-lg pt-xl border-t border-border-primary-50">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <span className="text-body-sm-semibold text-text-muted uppercase tracking-widest">
                  TỔNG TIỀN
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

            <AppButton 
              variant="primary" 
              className="w-full h-14 gap-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="size-6" />
              THÊM VÀO GIỎ
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
