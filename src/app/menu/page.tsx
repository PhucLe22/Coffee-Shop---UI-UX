"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { ProductCardDetailed, useInfiniteProducts, useSearchProducts } from "@/entities/product";
import { CategoryChips, CategoryId } from "@/features/filter-by-category";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatToVND, useIntersectionObserver } from "@/shared/lib";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedQuery.trim().length > 0;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteProducts({
    categoryId: activeCategory === "all" ? undefined : activeCategory,
  }, { enabled: !isSearching });

  const {
    data: searchData,
    isLoading: isSearchLoading,
  } = useSearchProducts(isSearching ? { q: debouncedQuery, limit: 10 } : null);

  const entry = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && !isSearching) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage, isSearching]);

  const allProducts = isSearching
    ? (searchData?.data ?? [])
    : (data?.pages.flatMap((page) => page.data) || []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

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

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm sản phẩm..."
          className="h-12 w-full rounded-xl bg-surface-main pl-12 pr-10 text-body-md-reg text-text-primary outline-none border border-border-primary-50 focus:border-brand-primary/30 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {!isSearching && (
        <CategoryChips activeId={activeCategory} onChange={setActiveCategory} />
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading || isSearchLoading) ? (
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
        ) : isError && !isSearching ? (
          <div className="col-span-full py-20 text-center text-text-secondary">
            Không thể tải sản phẩm. Vui lòng thử lại sau.
          </div>
        ) : allProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-secondary">
            {isSearching ? `Không tìm thấy sản phẩm "${debouncedQuery}".` : "Không có sản phẩm nào trong danh mục này."}
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

      {/* Lazy Loading Trigger (only when not searching) */}
      {!isSearching && (
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
      )}
    </div>
  );
}
