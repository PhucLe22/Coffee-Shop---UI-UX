"use client";

import { useNewProducts, ProductCardDetailed } from "@/entities/product";
import { cn, formatToVND } from "@/shared/lib";

interface SuggestionSectionProps {
  className?: string;
}

export function SuggestionSection({ className }: SuggestionSectionProps) {
  const { data, isLoading } = useNewProducts(4);
  const products = data?.data ?? [];

  if (isLoading) return null;
  if (products.length === 0) return null;

  return (
    <section className={cn("flex flex-col gap-xl", className)}>
      <h2 className="text-h3-bold text-text-primary">Sản phẩm mới</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
        {products.map((product) => (
          <ProductCardDetailed
            key={product.id}
            name={product.name}
            price={formatToVND(product.basePrice)}
            description={product.description}
            calories="0"
            size="Medium"
            slug={product.slug}
            imageUrl={product.thumbnail ?? undefined}
          />
        ))}
      </div>
    </section>
  );
}
