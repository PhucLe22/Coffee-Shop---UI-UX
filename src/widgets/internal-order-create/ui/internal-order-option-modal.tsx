"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { 
  SizeSelector, 
  OptionButton, 
  OptionCard, 
  useProduct,
  Product
} from "@/entities/product";
import { formatToVND, useIsMobile } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useInternalCartStore } from "@/entities/order";
import { toast } from "sonner";
import { Skeleton } from "@/shared/ui/skeleton";

interface InternalOrderOptionModalProps {
  productSlug: string | null;
  onClose: () => void;
}

export const InternalOrderOptionModal = ({ 
  productSlug, 
  onClose 
}: InternalOrderOptionModalProps) => {
  const isMobile = useIsMobile();
  const addItem = useInternalCartStore((state) => state.addItem);
  
  const { data: response, isLoading } = useProduct(productSlug || "");
  const product = response?.data;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.optionGroups) {
      const initial: Record<string, string[]> = {};
      product.optionGroups.forEach(group => {
        if (group.isRequired && group.options.length > 0) {
          initial[group.id] = [group.options[0].id];
        } else {
          initial[group.id] = [];
        }
      });
      setSelectedOptions(initial);
    }
  }, [product]);

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
    const formatted: { name: string; price: number; optionId: string }[] = [];
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = product?.optionGroups?.find((g) => g.id === groupId);
      if (group) {
        optionIds.forEach((optionId) => {
          const option = group.options.find((o) => o.id === optionId);
          if (option) {
            formatted.push({
              optionId: option.id,
              name: option.name,
              price: option.price || 0,
            });
          }
        });
      }
    });
    return formatted;
  };

  const calculateTotalPrice = () => {
    const formattedOptions = getSelectedOptionsFormatted();
    const extraPrice = formattedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return ((product?.basePrice || 0) + extraPrice) * quantity;
  };

  const handleAddToOrder = () => {
    if (!product) return;
    const formattedOptions = getSelectedOptionsFormatted();
    const extraPrice = formattedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const itemPrice = product.basePrice + extraPrice;
    
    // Create a readable summary of options
    const size = formattedOptions.find(o => product.optionGroups?.find(g => g.id === product.optionGroups?.find(pg => pg.options.some(po => po.id === o.optionId))?.id)?.name.toLowerCase().includes('size'))?.name || "Standard";
    const milk = formattedOptions.find(o => product.optionGroups?.find(g => g.id === product.optionGroups?.find(pg => pg.options.some(po => po.id === o.optionId))?.id)?.name.toLowerCase().includes('milk'))?.name || "None";
    const toppings = formattedOptions.filter(o => !product.optionGroups?.find(g => g.id === product.optionGroups?.find(pg => pg.options.some(po => po.id === o.optionId))?.id)?.name.toLowerCase().includes('size') && !product.optionGroups?.find(g => g.id === product.optionGroups?.find(pg => pg.options.some(po => po.id === o.optionId))?.id)?.name.toLowerCase().includes('milk')).map(o => o.name);

    addItem({
      id: `${product.id}-${Date.now()}`, // Unique ID for each cart item
      productId: product.id,
      name: product.name,
      price: itemPrice,
      quantity,
      image: product.thumbnail || undefined,
      selectedOptionIds: formattedOptions.map(o => o.optionId),
      options: {
        size,
        milk,
        toppings
      }
    });
    
    toast.success(`Added ${product.name} to order`);
    onClose();
  };

  if (!productSlug) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md md:p-lg bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#fff8f3] w-full max-w-6xl h-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-text-primary shadow-md transition-all active:scale-90"
        >
          <X className="size-6" />
        </button>

        {/* Product Image - Left side on desktop */}
        {!isMobile && (
          <div className="w-1/2 h-full relative overflow-hidden bg-surface-muted">
            {isLoading ? (
              <Skeleton className="size-full" />
            ) : (
              <img 
                src={product?.thumbnail || "/placeholder-product.jpg"} 
                alt={product?.name} 
                className="size-full object-cover animate-in zoom-in-95 duration-500"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#330f00]/40 to-transparent" />
          </div>
        )}

        {/* Customization Area - Right side */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-lg md:p-xl flex flex-col gap-lg">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-sm">
                  <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">{product?.category.name}</span>
                  <h2 className="text-h2-bold md:text-display-sm text-text-primary leading-tight">{product?.name}</h2>
                  <p className="text-body-md-reg text-text-muted max-w-lg">{product?.description}</p>
                </div>

                <div className="flex flex-col gap-xl mt-md">
                  {product?.optionGroups?.sort((a, b) => a.sortOrder - b.sortOrder).map((group) => (
                    <section key={group.id} className="flex flex-col gap-4">
                      <div className="flex w-full items-center justify-between border-b border-border-primary-50/5 pb-2">
                        <h5 className="text-[12px] font-bold text-text-secondary uppercase tracking-widest">{group.name}</h5>
                        <Badge variant="outline" className="text-[9px] font-bold uppercase border-text-muted/20 text-text-muted rounded-full">
                          {group.isRequired ? "REQUIRED" : "OPTIONAL"}
                        </Badge>
                      </div>

                      {group.isMultiple ? (
                        <div className="grid grid-cols-1 gap-3">
                          {group.options.sort((a, b) => a.sortOrder - b.sortOrder).map((option) => (
                            <OptionCard
                              key={option.id}
                              name={option.name}
                              price={option.price || 0}
                              isSelected={selectedOptions[group.id]?.includes(option.id)}
                              onToggle={() => toggleOption(group.id, option.id, true)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          {group.options.sort((a, b) => a.sortOrder - b.sortOrder).map((option) => {
                            const isSizeGroup = group.name.toLowerCase().includes('size');
                            
                            if (isSizeGroup) {
                              return (
                                <SizeSelector
                                  key={option.id}
                                  label={option.name}
                                  volume=""
                                  isActive={selectedOptions[group.id]?.includes(option.id)}
                                  onClick={() => toggleOption(group.id, option.id, false)}
                                  className="w-[120px] md:w-[140px]"
                                />
                              );
                            }

                            return (
                              <OptionButton
                                key={option.id}
                                label={option.name}
                                isSelected={selectedOptions[group.id]?.includes(option.id)}
                                onClick={() => toggleOption(group.id, option.id, false)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-lg md:p-xl bg-[#faf2eb] border-t border-border-primary-50/10 flex flex-col md:flex-row items-center gap-lg">
            <div className="flex items-center justify-between w-full md:w-auto md:gap-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Amount</span>
                <span className="text-h3-bold md:text-h2-bold text-brand-primary leading-none">{formatToVND(calculateTotalPrice())}</span>
              </div>
              
              <div className="flex items-center gap-md bg-white rounded-full px-md py-2 border border-border-primary-50/10 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="size-10 flex items-center justify-center rounded-full bg-surface-muted hover:bg-surface-accent transition-colors active:scale-90"
                >
                  <Minus className="size-4" />
                </button>
                <span className="text-lg font-bold min-w-[30px] text-center tabular-nums">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="size-10 flex items-center justify-center rounded-full bg-surface-muted hover:bg-surface-accent transition-colors active:scale-90"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToOrder}
              disabled={isLoading || !product}
              className="w-full md:flex-1 h-14 bg-brand-primary text-white font-extrabold text-[14px] tracking-widest shadow-xl shadow-brand-primary/20 rounded-full transition-transform active:scale-[0.98]"
            >
              ADD TO ORDER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
