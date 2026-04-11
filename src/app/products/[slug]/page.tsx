"use client";

import { useState, use, useEffect } from "react";
import {
  SizeSelector,
  OptionButton,
  OptionCard,
} from "@/entities/product";
import { useIsMobile } from "@/shared/lib";
import { DesktopProductDetail } from "@/widgets/product-detail";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data
  const product = {
    name: "Iced Salted Latte",
    category: "SEASONAL COLD BREW",
    origin: "Single Estate Ethiopian Beans",
    basePrice: 6.50,
    description:
      "Our signature double-shot espresso, velvet-soft milk, and a delicate touch of hand-harvested Maldon sea salt. Finished with a burnt-sugar drizzle.",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1974&auto=format&fit=crop",
    sizes: [
      { id: "s", label: "Standard", volume: "12oz", price: 0 },
      { id: "m", label: "Medium", volume: "16oz", price: 1.50 },
      { id: "l", label: "Large", volume: "20oz", price: 2.50 },
    ],
    sweetness: ["None", "25%", "50%", "75%", "100%"],
    toppings: [
      { id: 1, name: "Cold Foam Head", description: "Signature silky texture", price: 0.85, selected: true },
      { id: 2, name: "Extra Maldon Salt", description: "For the bold palate", price: 0.25, selected: false },
    ],
  };

  // State quản lý lựa chọn
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedSweetness, setSelectedSweetness] = useState("25%");
  const [toppings, setToppings] = useState(product.toppings);

  // Hàm toggle topping
  const toggleTopping = (id: number) => {
    setToppings((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)),
    );
  };

  if (!mounted) return null;

  if (!isMobile) {
    return (
      <DesktopProductDetail product={product} />
    );
  }

  return (
    <div className="flex flex-col bg-surface-accent ">
      {/* Hero Section */}
      <section className="relative aspect-square w-full">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 gap-2">
          <div className="flex h-6 w-fit items-center rounded-full bg-orange-500 px-3">
            <span className="text-[10px] font-bold text-white uppercase">
              BEST SELLER
            </span>
          </div>
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
              Product Origin
            </h2>
            <span className="text-sm text-text-secondary font-semibold">
              {product.origin}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-orange-600 block">
              {product.basePrice}
            </span>
            <span className="text-[10px] font-bold text-text-secondary uppercase">
              BASE PRICE
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <section className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <h5 className="text-h5-bold">Select Size</h5>
            <span className="text-label-badge text-text-secondary uppercase">
              REQUIRED
            </span>
          </div>
          <div className="flex gap-4 w-full">
            {product.sizes.map((size) => (
              <SizeSelector
                key={size.id}
                label={size.label}
                volume={size.volume}
                isActive={selectedSize === size.id}
                onClick={() => setSelectedSize(size.id)}
                className="flex-1"
              />
            ))}
          </div>
        </section>

        {/* Sweetness */}
        <section className="flex flex-col gap-4">
          <div className="flex w-full justify-between items-center">
            <h5 className="text-h5-bold">Sweetness Level</h5>
            <span className="text-label-badge  text-text-secondary uppercase">
              optional
            </span>
          </div>

          <div className="flex items-center justify-between overflow-x-auto no-scrollbar">
            {product.sweetness.map((level) => (
              <OptionButton
                key={level}
                label={level}
                isSelected={selectedSweetness === level}
                onClick={() => setSelectedSweetness(level)}
              />
            ))}
          </div>
        </section>

        {/* Toppings */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold">Extra Toppings</h3>
          <div className="flex flex-col gap-3">
            {toppings.map((topping) => (
              <OptionCard
                key={topping.id}
                name={topping.name}
                price={topping.price}
                isSelected={topping.selected}
                onToggle={() => toggleTopping(topping.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
