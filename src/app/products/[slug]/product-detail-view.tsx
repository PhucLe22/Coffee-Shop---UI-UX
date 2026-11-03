"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import {
  SizeSelector,
  OptionButton,
  OptionCard,
  useProduct,
} from "@/entities/product";
import { useIsMobile, formatToVND, useRouteParam } from "@/shared/lib";
import { DesktopProductDetail } from "@/widgets/product-detail";
import { Skeleton } from "@/shared/ui/skeleton";
import { useCartStore } from "@/entities/cart";
import { toast } from "sonner";

export function ProductDetailView({ slugParam }: { slugParam: string }) {
  const slug = useRouteParam(slugParam);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

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

  const { data: response, isLoading, isError } = useProduct(slug);
  const product = response?.data;

  // State quản lý lựa chọn
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize selectedOptions when product is loaded
  useEffect(() => {
    if (product?.optionGroups) {
      const initial: Record<string, string[]> = {};
      product.optionGroups.forEach(group => {
        if (group.options.length > 0) {
          const defaultId = getDefaultOptionId(group, group.isRequired);
          initial[group.id] = defaultId ? [defaultId] : [];
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
    const formatted: { optionId: string; name: string; price: number }[] = [];
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = product?.optionGroups?.find((g) => g.id === groupId);
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
    if (!product) return;
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
    return (Number(product?.basePrice || 0) + extraPrice) * quantity;
  };

  const totalPrice = calculateTotalPrice();

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[50vh] items-center justify-center p-6 text-center text-text-secondary">
        Không tìm thấy sản phẩm hoặc tải thất bại.
      </div>
    );
  }

  if (!isMobile) {
    return (
      <DesktopProductDetail product={product} />
    );
  }

  return (
    <div className="flex flex-col bg-surface-accent pb-32">
      {/* Hero Section */}
      <section className="relative aspect-square w-full">
        <img
          src={product.thumbnail || "/placeholder-product.jpg"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 gap-2">
          {product.isActive && (
            <div className="flex h-6 w-fit items-center rounded-full bg-orange-500 px-3">
              <span className="text-[10px] font-bold text-white uppercase">
                CÓ SẴN
              </span>
            </div>
          )}
          <h1 className="text-3xl font-bold text-white leading-tight">
            {product.name}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex flex-col gap-8 p-6">
        {/* Origin & Price */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-text-secondary">
              Danh Mục
            </h2>
            <span className="text-sm text-text-secondary font-semibold">
              {product.category.name}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-orange-600 block">
              {formatToVND(product.basePrice)}
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase">
              GIÁ CƠ BẢN
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-body-md-reg text-text-muted">
          {product.description}
        </p>

        {/* Dynamic Option Groups */}
        {product.optionGroups?.sort((a, b) => a.sortOrder - b.sortOrder).map((group) => (
          <section key={group.id} className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h5 className="text-h5-bold">{({ 'Sugar Level': 'Độ ngọt', 'Ice Level': 'Lượng đá' } as Record<string, string>)[group.name] || group.name}</h5>
            </div>

            {group.isMultiple && group.name.toLowerCase().includes('topping') && (
              <p className="text-body-sm-reg text-text-muted -mt-1">
                Chọn tối đa {group.options.length} loại Topping
              </p>
            )}

            {group.isMultiple ? (
              <div className="flex flex-col gap-3">
                {group.options.sort((a, b) => a.sortOrder - b.sortOrder).map((option) => (
                  <OptionCard
                    key={option.id}
                    name={option.name}
                    price={Number(option.price || 0)}
                    isSelected={selectedOptions[group.id]?.includes(option.id)}
                    onToggle={() => toggleOption(group.id, option.id, true)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
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
                        className=""
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
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 p-6 flex items-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-3">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-gray-600 active:scale-95 transition-transform"
          >
            <Minus className="size-4" />
          </button>
          <span className="font-bold min-w-[20px] text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="text-gray-600 active:scale-95 transition-transform"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-brand-primary text-white rounded-full py-4 px-6 flex items-center justify-between shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all"
        >
          <span className="font-bold">Thêm vào giỏ hàng</span>
          <span className="font-bold">{formatToVND(totalPrice)}</span>
        </button>
      </div>
    </div>
  );
}
