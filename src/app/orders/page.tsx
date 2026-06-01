"use client";

import { useState } from "react";
import { OrderHistory } from "./order-history";
import { OrderSuggestions } from "./order-suggestions";
import { useOrders } from "@/entities/order";
import { cn, useIsMobile } from "@/shared/lib";
import { ChevronLeft, Loader2, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { ActiveProcessingOrder } from "@/widgets/active-processing-order";
import { ReadyToPickUpOrder } from "@/widgets/ready-to-pickup-order";
import { AppButton, Input, Label } from "@/shared/ui";
import { OrderStatus } from "@/shared/api";

export default function OrdersPage() {
  const isMobile = useIsMobile();
  const router = useRouter();

  // Filter State
  const [filters, setFilters] = useState({
    status: undefined as OrderStatus | undefined,
    startDate: "",
    endDate: "",
    minTotal: undefined as number | undefined,
    maxTotal: undefined as number | undefined,
    page: 1,
    limit: 10,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useOrders({
    status: filters.status,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    minTotal: filters.minTotal,
    maxTotal: filters.maxTotal,
    page: filters.page,
    limit: filters.limit,
  });

  const orders = Array.isArray(ordersResponse?.data)
    ? ordersResponse.data
    : (ordersResponse?.data as any)?.items || [];
  const meta = Array.isArray(ordersResponse?.data)
    ? (ordersResponse as any).meta
    : (ordersResponse?.data as any)?.meta;

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      startDate: "",
      endDate: "",
      minTotal: undefined,
      maxTotal: undefined,
      page: 1,
      limit: 10,
    });
  };

  const FilterSection = () => (
    <div
      className={cn(
        "flex flex-col gap-md p-lg rounded-2xl border transition-all duration-300",
        isFilterOpen
          ? "max-h-[500px] opacity-100 mb-lg"
          : "max-h-0 opacity-0 overflow-hidden mb-0",
        !isMobile
          ? "bg-[#ebe0d9]/50 border-text-primary/10"
          : "bg-surface-muted border-border-primary-50",
      )}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Status Filter */}
        <div className="flex flex-col gap-sm">
          <Label className="text-xs font-bold text-text-muted">
            TRẠNG THÁI
          </Label>
          <select
            className="h-10 w-full rounded-lg bg-[#faf2eb] px-md text-sm border-none focus:ring-1 focus:ring-brand-primary"
            value={filters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }>
            <option value="">Tất cả trạng thái</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filters */}
        <div className="flex flex-col gap-sm">
          <Label className="text-xs font-bold text-text-muted">
            KHOẢNG THỜI GIAN
          </Label>
          <div className="flex items-center gap-xs">
            <Input
              type="date"
              className="h-10 text-xs bg-[#faf2eb]"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
            <span className="text-text-muted">-</span>
            <Input
              type="date"
              className="h-10 text-xs bg-[#faf2eb]"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>

        {/* Amount Filters */}
        <div className="flex flex-col gap-sm">
          <Label className="text-xs font-bold text-text-muted">
            KHOẢNG GIÁ (VND)
          </Label>
          <div className="flex items-center gap-xs">
            <Input
              type="number"
              placeholder="Từ"
              className="h-10 text-xs bg-[#faf2eb]"
              value={filters.minTotal || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minTotal",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
            <span className="text-text-muted">-</span>
            <Input
              type="number"
              placeholder="Đến"
              className="h-10 text-xs bg-[#faf2eb]"
              value={filters.maxTotal || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxTotal",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-md pt-md mt-md border-t border-text-primary/10">
        <button
          onClick={clearFilters}
          className="text-xs font-bold text-text-muted hover:text-text-primary transition-colors">
          XÓA TẤT CẢ
        </button>
        <AppButton
          variant="primary"
          size="sm"
          className="h-8 rounded-full px-lg text-[10px]"
          onClick={() => setIsFilterOpen(false)}>
          ÁP DỤNG BỘ LỌC
        </AppButton>
      </div>
    </div>
  );

  // Filter orders for specialized widgets
  const processingOrder = orders.find((o) =>
    ["NEW", "CONFIRMED", "PREPARING"].includes(o.status),
  );
  const readyOrder = orders.find((o) => o.status === "READY");
  const completedOrders = orders.filter((o) =>
    ["COMPLETED", "CANCELLED", "REFUNDED"].includes(o.status),
  );

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-surface-main pb-20 pt-10">
        <main className="container mx-auto px-4 py-12 flex flex-col gap-12">
          {/* Header & Filter Toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-display-sm font-extrabold font-plus-jakarta text-text-primary">
              Đơn hàng của bạn
            </h1>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "flex items-center gap-sm px-lg py-md rounded-xl border transition-all active:scale-95",
                isFilterOpen
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-surface-muted text-text-primary border-text-primary/10 hover:border-brand-primary/50",
              )}>
              <Filter className="size-5" />
              <span className="text-body-sm-bold">Bộ lọc</span>
            </button>
          </div>

          <FilterSection />

          {/* Bento Grid Order History */}
          {!isFilterOpen && (
            <div className="grid grid-cols-12 gap-8 min-h-[415px]">
              <div className="col-span-8">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center rounded-xl bg-surface-muted/30">
                    <Loader2 className="size-8 animate-spin text-brand-primary" />
                  </div>
                ) : processingOrder ? (
                  <ActiveProcessingOrder order={processingOrder as any} />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-text-primary/20 bg-surface-muted/30 p-10">
                    <p className="text-text-muted font-bold">
                      Không có đơn hàng nào đang xử lý
                    </p>
                  </div>
                )}
              </div>
              <div className="col-span-4 flex flex-col gap-8">
                {isLoading ? (
                  <div className="flex-1 rounded-[20px] bg-surface-muted/30 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-brand-primary" />
                  </div>
                ) : readyOrder ? (
                  <ReadyToPickUpOrder order={readyOrder as any} />
                ) : (
                  <div className="flex-1 rounded-[20px] border border-dashed border-text-primary/20 bg-surface-muted/30 p-8 flex items-center justify-center">
                    <p className="text-text-muted font-bold text-center">
                      Không có đơn hàng nào sẵn sàng nhận
                    </p>
                  </div>
                )}

                {/* Points Card */}
                <div className="flex-1 rounded-[20px] bg-[#f0660a] p-8 text-inverse-text shadow-sm flex flex-col justify-between min-h-[200px]">
                  <div>
                    <span className="text-[14px] font-bold uppercase tracking-widest opacity-80 font-inter">
                      COLLECTIVE POINTS
                    </span>
                    <h3 className="text-[36px] font-extrabold leading-tight font-plus-jakarta mt-1">
                      2,450 pts
                    </h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full w-[78%]" />
                    </div>
                    <div className="flex items-center justify-between text-[12px] font-bold font-inter opacity-90">
                      <span>GOLD MEMBER</span>
                      <span>550 pts to Platinum</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Completed Orders Section */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[32px] font-extrabold font-plus-jakarta text-text-primary tracking-tight">
                {isFilterOpen ? "Kết quả tìm kiếm" : "Đơn hàng gần đây"}
              </h2>
              <div className="flex gap-3">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handleFilterChange("page", filters.page - 1)}
                  className="flex size-10 items-center justify-center rounded-xl bg-[#ebe0d9] border border-text-primary/10 text-text-muted hover:text-brand-primary disabled:opacity-50 transition-all active:scale-95">
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  disabled={!meta?.hasNext}
                  onClick={() => handleFilterChange("page", filters.page + 1)}
                  className="flex size-10 items-center justify-center rounded-xl bg-[#ebe0d9] border border-text-primary/10 text-text-muted hover:text-brand-primary disabled:opacity-50 transition-all active:scale-95">
                  <ChevronLeft className="size-5 rotate-180" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-lg mt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 w-full animate-pulse rounded-2xl bg-[#ebe0d9]/50"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-20 bg-surface-muted rounded-[32px] border border-dashed border-red-200">
                <p className="text-body-md-bold text-red-500">
                  Đã có lỗi xảy ra khi tải đơn hàng.
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 text-sm font-bold text-brand-primary">
                  Thử lại
                </button>
              </div>
            ) : (
              <OrderHistory
                orders={orders as any}
                showHeader={false}
                className="gap-8"
                activeStatus={filters.status || "all"}
                onStatusChange={(status) =>
                  handleFilterChange("status", status)
                }
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface-accent">
      <main className="flex flex-1 flex-col gap-xl p-md pb-24">
        <div className="flex items-center justify-between px-1">
          <h1 className="text-h2-bold text-text-primary">Đơn hàng</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "p-sm rounded-full transition-all active:scale-90",
              isFilterOpen
                ? "bg-brand-primary text-white"
                : "bg-surface-muted text-text-primary",
            )}>
            <Filter className="size-5" />
          </button>
        </div>

        <FilterSection />

        {isLoading ? (
          <div className="flex flex-col gap-lg mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-2xl bg-surface-muted"
              />
            ))}
          </div>
        ) : (
          <OrderHistory
            orders={orders as any}
            activeStatus={filters.status || "all"}
            onStatusChange={(status) => handleFilterChange("status", status)}
          />
        )}

        {!isFilterOpen && <OrderSuggestions />}

        {/* Mobile Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-md mt-lg pb-xl">
            <button
              disabled={filters.page === 1}
              onClick={() => handleFilterChange("page", filters.page - 1)}
              className="p-md rounded-full bg-surface-main shadow-sm disabled:opacity-50">
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-body-sm-bold text-text-primary">
              Trang {filters.page} / {meta.totalPages}
            </span>
            <button
              disabled={!meta?.hasNext}
              onClick={() => handleFilterChange("page", filters.page + 1)}
              className="p-md rounded-full bg-surface-main shadow-sm disabled:opacity-50">
              <ChevronLeft className="size-5 rotate-180" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
