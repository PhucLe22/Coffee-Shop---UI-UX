"use client";

import { useState, useRef, useEffect } from "react";
import { ProductCardDetailed, useInfiniteProducts } from "@/entities/product";
import { CategoryChips, CategoryId } from "@/features/filter-by-category";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatToVND, useIntersectionObserver } from "@/shared/lib";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    categoryId: activeCategory === "all" ? undefined : activeCategory,
  });

  const entry = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="flex flex-col gap-8 bg-surface-accent px-6 py-12 pb-24 min-h-full">
      {/* Hero Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-h2-bold text-text-primary whitespace-pre-line">
          Danh Mục{"\n"}Đồ Uống
        </h2>
        <p className="text-body-md-reg text-text-secondary whitespace-pre-line">
          Được tuyển chọn từ những vùng đất núi lửa, rang{"\n"}thủ công từng mẻ nhỏ để đạt hương vị tối ưu.
        </p>
      </div>

      {/* Filter Chips */}
      <CategoryChips activeId={activeCategory} onChange={setActiveCategory} />

      {/* Product List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-md bg-white p-4 shadow-sm">
              <Skeleton className="aspect-[358/256] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          ))
        ) : isError ? (
          <div className="col-span-full py-20 text-center text-text-secondary">
            Không thể tải sản phẩm. Vui lòng thử lại sau.
          </div>
        ) : allProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-secondary">
            Không có sản phẩm nào trong danh mục này.
          </div>
        ) : (
          <>
            {allProducts.map((product) => (
              <ProductCardDetailed
                key={product.id}
                name={product.name}
                price={formatToVND(product.basePrice)}
                description={product.description}
                calories={"0"}
                size={"Medium"}
                slug={product.slug || product.id}
                imageUrl={product.thumbnail || undefined}
                badge={undefined}
              />
            ))}
          </>
        )}
      </div>

      {/* Lazy Loading Trigger */}
      <div
        ref={loadMoreRef}
        className="h-10 w-full flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce"></div>
          </div>
        )}
      </div>
    </div>
  );
}
