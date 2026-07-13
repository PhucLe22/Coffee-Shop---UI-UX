"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, 
  RefreshCcw, 
  Loader2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { AppButton } from "@/shared/ui/app-button";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { CreateProductDialog } from "@/features/create-product";
import { UpdateProductDialog } from "@/features/update-product/ui/update-product-dialog";
import { useInfiniteProducts, Product, ProductService } from "@/entities/product";
import { useCategories } from "@/entities/category";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStaffAuthStore } from "@/shared/auth";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function InternalInventoryPage() {
  const queryClient = useQueryClient();
  const { user } = useStaffAuthStore();
  const canDelete = user?.role?.toUpperCase() === "ADMIN";
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const toggleMutation = useMutation({
    mutationFn: (productId: string) => ProductService.toggleActive(productId),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });
    },
    onError: () => toast.error("Không thể cập nhật trạng thái sản phẩm"),
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => ProductService.deleteAdminProduct(productId),
    onSuccess: () => {
      toast.success("Xóa sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: ["products-infinite"] });
    },
    onError: () => toast.error("Không thể xóa sản phẩm"),
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: categoriesData } = useCategories(1, 100);
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading,
    refetch 
  } = useInfiniteProducts({
    categoryId: activeCategoryId === "ALL" ? undefined : activeCategoryId,
    search: debouncedSearch || undefined,
    isActive: statusFilter === "ALL" ? undefined : statusFilter === "ACTIVE",
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  // Group and sort products by category for display
  const groupedProducts = useMemo(() => {
    const groups: Record<string, { category: { id: string, name: string, sortOrder?: number }, products: Product[] }> = {};
    
    // Sort all products by their own sortOrder first
    const sortedProducts = [...products].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    sortedProducts.forEach((product) => {
      const catId = product.categoryId;
      
      if (!groups[catId]) {
        // Find full category object from categoriesData if possible
        const fullCat = categoriesData?.data.find(c => c.id === catId) || product.category;
        groups[catId] = { 
          category: fullCat, 
          products: [] 
        };
      }
      groups[catId].products.push(product);
    });

    // Sort the groups by category sortOrder
    return Object.values(groups).sort((a, b) => {
      const orderA = a.category.sortOrder ?? 999;
      const orderB = b.category.sortOrder ?? 999;
      return orderA - orderB;
    });
  }, [products, categoriesData]);

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex flex-col gap-xs">
          <h1 className="text-h2-bold text-text-primary">Quản Lý Kho Hàng</h1>
          <p className="text-body-md-reg text-text-secondary">Cập nhật tình trạng tồn kho theo thời gian thực.</p>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative w-full max-w-xs hidden md:block">
            <Input 
              placeholder="Tìm kiếm trong kho..." 
              className="pl-xl h-10 bg-white/50 border-border-primary-50 rounded-md focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateProductDialog />
          <Button 
            variant="outline" 
            size="icon" 
            className="size-10 border-border-primary-50 rounded-md bg-white"
            onClick={() => refetch()}
          >
            <RefreshCcw className={cn("size-4 text-text-primary", isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-sm">
        {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => (
          <Button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "rounded-md h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all",
              statusFilter === status
                ? "bg-brand-primary text-white shadow-md"
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            )}
          >
            {status === "ALL" ? "TẤT CẢ" : status === "ACTIVE" ? "HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
          </Button>
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-sm overflow-x-auto no-scrollbar pb-xs">
        <Button
          onClick={() => setActiveCategoryId("ALL")}
          className={cn(
            "rounded-md h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all",
            activeCategoryId === "ALL" 
              ? "bg-text-primary text-white shadow-md" 
              : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
          )}
        >
          TẤT CẢ
        </Button>
        {categoriesData?.data.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={cn(
              "rounded-md h-8 px-lg text-[11px] font-extrabold tracking-widest transition-all",
              activeCategoryId === cat.id 
                ? "bg-text-primary text-white shadow-md" 
                : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
            )}
          >
            {cat.name.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="flex flex-col gap-xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-10 animate-spin text-brand-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md">
            <p className="text-text-secondary">Không tìm thấy sản phẩm.</p>
          </div>
        ) : (
          groupedProducts.map((group) => (
            <div key={group.category.id} className="flex flex-col gap-lg">
              <h3 className="text-body-sm-bold text-brand-primary uppercase tracking-[0.2em]">
                {group.category.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-lg">
                {group.products.map((item) => (
                  <InventoryCard key={item.id} item={item} onEdit={setEditingProduct} onToggle={() => toggleMutation.mutate(item.id)} onDelete={() => deleteMutation.mutate(item.id)} isDeleting={deleteMutation.isPending} canDelete={canDelete} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <Loader2 className="size-6 animate-spin text-brand-primary" />
        )}
      </div>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <UpdateProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
        />
      )}

    </div>
  );
}

function InventoryCard({ item, onEdit, onToggle, onDelete, isDeleting, canDelete }: { item: Product, onEdit: (product: Product) => void, onToggle: () => void, onDelete: () => void, isDeleting: boolean, canDelete: boolean }) {
  return (
    <Card className={cn(
      "bg-surface-accent border-0 shadow-sm rounded-md overflow-hidden group transition-all duration-300",
      !item.isActive ? "opacity-75 grayscale-[0.5]" : "hover:shadow-md"
    )}>
      <CardContent className="p-md flex items-center justify-between gap-md">
        <div 
          className="flex items-center gap-md cursor-pointer flex-grow"
          onClick={() => onEdit(item)}
        >
          <div className="size-16 md:size-20 rounded-md overflow-hidden bg-white border border-border-primary-50/20 flex-shrink-0">
            {item.thumbnail ? (
              <img 
                src={item.thumbnail} 
                alt={item.name} 
                className="size-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <div className="size-full bg-surface-muted flex items-center justify-center">
                <Search className="size-6 text-text-muted" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-body-lg-bold md:text-h5-bold text-text-primary leading-tight flex items-center gap-2">
              {item.name}
              <Pencil className="size-3 text-text-muted group-hover:text-brand-primary" />
            </h4>
            <p className="text-[12px] md:text-body-sm-reg text-text-secondary leading-snug">
              {item.sku} · {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.basePrice))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-sm">
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="text-text-muted hover:text-error transition-colors"
                  title="Xóa sản phẩm"
                >
                  <Trash2 className="size-4" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-md border-0 overflow-y-auto max-h-[85vh]">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 text-red-500 mb-2">
                    <AlertTriangle className="size-6 shrink-0" />
                    <AlertDialogTitle className="text-h4-bold">Xóa sản phẩm?</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-body-md-reg">
                    Hành động này không thể hoàn tác. Sản phẩm <strong>{item.name}</strong> sẽ bị xóa vĩnh viễn.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel asChild>
                    <AppButton variant="outline" size="sm">Hủy</AppButton>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild onClick={onDelete}>
                    <AppButton size="sm" isLoading={isDeleting} className="bg-red-500 text-white hover:bg-red-600">
                      XÓA SẢN PHẨM
                    </AppButton>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <button 
            onClick={onToggle}
            className="text-text-muted hover:text-brand-primary transition-colors"
          >
            {item.isActive ? (
              <ToggleRight className="size-8 text-brand-primary" />
            ) : (
              <ToggleLeft className="size-8" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
