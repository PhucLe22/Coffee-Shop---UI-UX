"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MapPin, Store, Plus, Pencil, Users, ChevronLeft, ChevronRight, Loader2, RotateCcw,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useInternalStores, useUpdateStore } from "@/entities/store";
import { StoreOutput } from "@/shared/api";
import { CreateStoreDialog } from "@/features/create-store";
import { UpdateStoreDialog } from "@/features/update-store";
import { useIntersectionObserver } from "@/shared/lib/use-intersection-observer";
import { toast } from "sonner";

export default function InternalLocationsPage() {
  const [selectedStore, setSelectedStore] = useState<StoreOutput | null>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInternalStores();

  const allStores = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const currentPageStores = useMemo(
    () => data?.pages[currentPage - 1]?.data ?? [],
    [data, currentPage],
  );

  const { mutate: updateStore, isPending: isUpdating } = useUpdateStore();

  const handleRecover = (store: StoreOutput, e: React.MouseEvent) => {
    e.stopPropagation();
    updateStore(
      { id: store.id, data: { isDeleted: false } },
      {
        onSuccess: () => {
          toast.success(`${store.name} has been recovered`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to recover store");
        },
      },
    );
  };

  const totalPages = data?.pages[0]?.meta?.totalPages ?? 1;
  const totalItems = data?.pages[0]?.meta?.totalItems ?? 0;

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(loadMoreRef, {
    threshold: 0,
    rootMargin: "0px 0px 200px 0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleNextPage = async () => {
    if (currentPage >= totalPages) return;
    if (!data?.pages[currentPage]) {
      await fetchNextPage();
    }
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col p-md md:p-lg gap-lg animate-in fade-in duration-500 w-full max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h1 className="text-h3-bold text-text-primary">Store Locations</h1>
          <p className="text-body-sm-reg text-text-secondary">Manage your regional collective branches.</p>
        </div>
        <div className="flex items-center gap-md">
          <CreateStoreDialog />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
        {/* Store List */}
        <div className="lg:col-span-3 flex flex-col gap-lg order-last lg:order-none">
          {isLoading ? (
            <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden w-full min-w-0">
              <div className="p-lg space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </Card>
          ) : allStores.length === 0 ? (
            <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden w-full min-w-0">
              <div className="flex flex-col items-center justify-center py-20 gap-md">
                <Store className="size-16 text-text-muted/30" />
                <p className="text-body-md-reg text-text-secondary">Không tìm thấy cửa hàng</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Desktop Table */}
              <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden w-full min-w-0 max-md:hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-surface-accent/30 text-left border-b border-border-primary-50/10">
                        <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Code</th>
                        <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Branch Name</th>
                        <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Address</th>
                        <th className="p-lg text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Status</th>
                        <th className="p-lg text-right text-body-sm-semibold text-text-secondary uppercase tracking-widest text-[10px] font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageStores.map((store) => (
                        <tr
                          key={store.id}
                          className={cn(
                            "border-b border-border-primary-50/5 transition-colors group",
                            store.isDeleted
                              ? "bg-red-50/20 line-through decoration-1 opacity-60 cursor-default"
                              : "hover:bg-surface-main/30 cursor-pointer"
                          )}
                          onClick={() => {
                            if (store.isDeleted) return;
                            setSelectedStore(store);
                            setUpdateOpen(true);
                          }}
                        >
                          <td className="p-lg">
                            <span className={cn(
                              "font-mono tracking-wide",
                              store.isDeleted ? "text-body-sm-reg text-text-muted" : "text-body-sm-semibold text-text-primary"
                            )}>{store.code}</span>
                          </td>
                          <td className="p-lg">
                            <span className={cn(
                              store.isDeleted ? "text-body-sm-reg text-text-muted" : "text-body-sm-semibold text-text-primary"
                            )}>{store.name}</span>
                          </td>
                          <td className="p-lg">
                            <span className="text-[12px] text-text-muted flex items-center gap-1">
                              <MapPin className="size-3 shrink-0" /> {store.address}
                            </span>
                          </td>
                          <td className="p-lg">
                          <Badge className={cn(
                            "rounded-full px-md py-0.5 border-0 font-bold text-[10px] uppercase tracking-wide",
                            store.isDeleted
                              ? "bg-gray-100 text-gray-500"
                              : store.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                          )}>
                            {store.isDeleted ? "Deleted" : store.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-lg text-right">
                          {store.isDeleted ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-gray-400 hover:text-green-600 rounded-md"
                              onClick={(e) => handleRecover(store, e)}
                              disabled={isUpdating}
                            >
                              <RotateCcw className="size-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" className="size-8 text-text-muted hover:text-brand-primary rounded-md">
                              <Pencil className="size-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </Card>

              {/* Desktop Pagination */}
              {totalPages > 1 && (
                <div className="max-md:hidden flex items-center justify-between pt-3 pb-1">
                  <p className="text-[12px] text-text-muted">{totalItems} total stores</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      <ChevronLeft className="size-4" />
                      Prev
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          if (pageNum > currentPage && !data?.pages[pageNum - 1]) {
                            fetchNextPage();
                          }
                          setCurrentPage(pageNum);
                        }}
                        className={cn(
                          "min-w-[32px] text-[12px]",
                          pageNum === currentPage
                            ? "bg-brand-primary text-white hover:bg-brand-accent"
                            : "text-text-muted hover:text-text-primary"
                        )}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage >= totalPages || isFetchingNextPage}
                      onClick={handleNextPage}
                      className="text-text-muted hover:text-text-primary"
                    >
                      {isFetchingNextPage ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Mobile Cards */}
              <div className="md:hidden flex flex-col gap-2">
                {allStores.map((store) => (
                  <div
                    key={store.id}
                    className={cn(
                      "bg-white border border-border-primary-50/10 shadow-sm rounded-[10px] overflow-hidden transition-all duration-300",
                      store.isDeleted
                        ? "border-red-200 bg-red-50/20 opacity-70 cursor-default"
                        : "cursor-pointer hover:shadow-md active:scale-[0.99]",
                      !store.isDeleted && !store.isActive && "opacity-75"
                    )}
                    onClick={() => {
                      if (store.isDeleted) return;
                      setSelectedStore(store);
                      setUpdateOpen(true);
                    }}
                  >
                    <div className="p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className={cn(
                          "text-[10px] font-mono tracking-widest uppercase font-bold",
                          store.isDeleted ? "text-text-muted line-through" : "text-text-muted"
                        )}>{store.code}</span>
                        <Badge className={cn(
                          "rounded-full px-2 py-0.5 border-0 font-bold text-[9px] uppercase tracking-wide shrink-0",
                          store.isDeleted
                            ? "bg-gray-100 text-gray-500"
                            : store.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        )}>
                          {store.isDeleted ? "Deleted" : store.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <h3 className={cn(
                        store.isDeleted ? "text-body-sm-reg text-text-muted line-through" : "text-body-sm-semibold text-text-primary",
                        "leading-snug"
                      )}>{store.name}</h3>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="size-3.5 shrink-0 mt-0.5 text-text-muted" />
                        <span className="text-[12px] text-text-muted leading-snug">{store.address}</span>
                      </div>
                      {store.isDeleted && (
                        <div className="mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-200 gap-1"
                            onClick={(e) => handleRecover(store, e)}
                            disabled={isUpdating}
                          >
                            <RotateCcw className="size-3" />
                            Recover
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Infinite Scroll Sentinel */}
              {hasNextPage && (
                <div ref={loadMoreRef} className="md:hidden flex items-center justify-center py-4">
                  {isFetchingNextPage && (
                    <Loader2 className="size-5 animate-spin text-brand-primary" />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 flex flex-col gap-lg order-first lg:order-none">
          <Card className="bg-surface-accent border border-border-primary-50/20 shadow-sm rounded-md p-lg flex flex-col gap-md">
            <div className="flex items-center gap-md">
              <div className="size-10 rounded-md bg-white flex items-center justify-center shadow-sm border border-border-primary-50/10">
                <Store className="size-5 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Stores</span>
                <span className="text-body-md-bold text-text-primary">{allStores.length} {allStores.length > 1 ? "Locations" : "Location"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Update Dialog */}
      {selectedStore && (
        <UpdateStoreDialog
          store={selectedStore}
          open={updateOpen}
          onOpenChange={setUpdateOpen}
        />
      )}
    </div>
  );
}
