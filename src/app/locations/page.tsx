"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { useInfiniteStores, Store, useStoreStore } from "@/entities/store";
import { Input } from "@/shared/ui";
import { Search, MapPin, Phone, Check, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib";
import { useRouter } from "next/navigation";

const MOCK_COORDS: Record<string, [number, number]> = {
  "d88a47c0-5b6c-4776-90e6-53b289d0899c": [106.660172, 10.762622],
  "fd102949-677b-4843-ada1-8a940c738438": [106.700980, 10.776530],
};

const DEFAULT_CENTER: [number, number] = [106.660172, 10.762622];

export default function LocationsPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteStores();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const stores = useMemo(() => data?.pages.flatMap((p) => p.data) || [], [data]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    return stores.filter((store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
  };

  const getStoreCoords = (store: Store): [number, number] => {
    if (store.lng !== null && store.lat !== null) {
      return [store.lng, store.lat];
    }
    return MOCK_COORDS[store.id] || DEFAULT_CENTER;
  };

  return (
    <main className="flex h-[calc(100vh-102px)] min-h-[600px] w-full overflow-hidden bg-surface-main">
      <aside className="flex w-[400px] flex-col border-r border-surface-muted bg-white z-10">
        <div className="p-xl border-b border-surface-muted">
          <h1 className="text-h2-bold text-text-primary mb-md">Cửa hàng</h1>
          <div className="relative">
            <Search className="absolute left-md top-1/2 size-5 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Tìm kiếm cửa hàng..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-lg space-y-lg" id="store-list-scroll">
          {isLoading ? (
            <div className="flex items-center justify-center py-xl">
              <Loader2 className="size-6 animate-spin text-text-muted" />
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-xl text-text-muted">
              Không tìm thấy cửa hàng nào
            </div>
          ) : (
            <>
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onMouseEnter={() => setHoveredStoreId(store.id)}
                  onMouseLeave={() => setHoveredStoreId(null)}
                  onClick={() => handleSelectStore(store)}
                  className={cn(
                    "relative flex flex-col gap-sm rounded-md border p-lg transition-all cursor-pointer",
                    selectedStore?.id === store.id
                      ? "border-brand-primary bg-brand-primary/[0.03]"
                      : "border-surface-muted hover:border-brand-primary/50 hover:bg-surface-accent"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-body-lg-bold text-text-primary">
                      {store.name}
                    </h3>
                    {selectedStore?.id === store.id && (
                      <div className="flex size-6 items-center justify-center rounded-full bg-brand-primary text-white">
                        <Check className="size-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-sm text-text-secondary">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-primary" />
                    <p className="text-body-sm-reg leading-relaxed">{store.address}</p>
                  </div>

                  <div className="flex items-center gap-sm text-text-secondary">
                    <Phone className="size-4 shrink-0 text-brand-primary" />
                    <p className="text-body-sm-reg">{store.hotline}</p>
                  </div>
                </div>
              ))}

              <div ref={sentinelRef} className="flex items-center justify-center py-md">
                {isFetchingNextPage && (
                  <Loader2 className="size-5 animate-spin text-text-muted" />
                )}
                {!hasNextPage && stores.length > 0 && (
                  <span className="text-body-sm-reg text-text-muted">Đã hiển thị tất cả cửa hàng</span>
                )}
              </div>
            </>
          )}
        </div>
      </aside>

      <section className="relative flex-1 bg-surface-muted">
        <Map
          center={selectedStore ? getStoreCoords(selectedStore) : DEFAULT_CENTER}
          zoom={13}
          className="h-full w-full"
        >
          <MapControls position="top-right" showZoom showLocate showFullscreen />

          {filteredStores.map((store) => {
            const coords = getStoreCoords(store);
            const isHovered = hoveredStoreId === store.id;
            const isSelected = selectedStore?.id === store.id;

            return (
              <MapMarker
                key={store.id}
                longitude={coords[0]}
                latitude={coords[1]}
                onClick={() => handleSelectStore(store)}
              >
                <MarkerContent>
                  <div className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 border-white shadow-md transition-all",
                    isSelected || isHovered ? "bg-brand-primary scale-125 z-20" : "bg-surface-accent scale-100 z-10"
                  )}>
                    <MapPin className={cn("size-5", isSelected || isHovered ? "text-white" : "text-brand-primary")} />
                  </div>
                </MarkerContent>
                <MarkerPopup className="w-56 p-md">
                  <div className="space-y-sm">
                    <h4 className="text-body-md-bold text-text-primary">{store.name}</h4>
                    <p className="text-body-sm-reg text-text-secondary">{store.address}</p>
                    <button
                      onClick={() => handleSelectStore(store)}
                      className="w-full mt-sm py-xs bg-brand-primary text-white text-xs font-bold rounded-md hover:bg-brand-primary/90 transition-colors"
                    >
                      CHỌN CỬA HÀNG
                    </button>
                  </div>
                </MarkerPopup>
              </MapMarker>
            );
          })}
        </Map>

        {selectedStore && (
          <div className="absolute bottom-xl left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[400px]">
            <div className="bg-white p-lg rounded-md shadow-lg border border-surface-muted flex items-center justify-between gap-md">
              <div className="flex flex-col min-w-0">
                <span className="text-overline text-brand-primary">Đang chọn</span>
                <h3 className="text-body-lg-bold text-text-primary truncate">{selectedStore.name}</h3>
              </div>
              <button
                onClick={() => router.push("/menu")}
                className="shrink-0 bg-brand-primary text-white px-xl py-md rounded-full text-body-sm-bold hover:bg-brand-accent transition-colors active:scale-95"
              >
                XEM THỰC ĐƠN
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
