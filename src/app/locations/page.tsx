"use client";

import { useState, useMemo } from "react";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { useStores, Store, useStoreStore } from "@/entities/store";
import { Input } from "@/shared/ui";
import { Search, MapPin, Phone, Check, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib";
import { useRouter } from "next/navigation";

// Mock coordinates if API returns null
const MOCK_COORDS: Record<string, [number, number]> = {
  "d88a47c0-5b6c-4776-90e6-53b289d0899c": [106.660172, 10.762622], // Main Store
  "fd102949-677b-4843-ada1-8a940c738438": [106.700980, 10.776530], // System Store
};

const DEFAULT_CENTER: [number, number] = [106.660172, 10.762622];

export default function LocationsPage() {
  const router = useRouter();
  const { data: storesResponse, isLoading } = useStores();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);

  const stores = storesResponse?.data || [];

  const filteredStores = useMemo(() => {
    return stores.filter((store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    // Optionally redirect to home or menu after selection
    // router.push("/");
  };

  const getStoreCoords = (store: Store): [number, number] => {
    if (store.lng !== null && store.lat !== null) {
      return [store.lng, store.lat];
    }
    return MOCK_COORDS[store.id] || DEFAULT_CENTER;
  };

  return (
    <main className="flex h-[calc(100vh-102px)] min-h-[600px] w-full overflow-hidden bg-surface-main">
      {/* Sidebar */}
      <aside className="flex w-[400px] flex-col border-r border-border-primary-50 bg-surface-main shadow-lg z-10">
        <div className="p-xl border-b border-border-primary-50">
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

        <div className="flex-1 overflow-y-auto p-md space-y-md">
          {isLoading ? (
            <div className="flex items-center justify-center py-xl">
              <span className="animate-pulse text-text-muted">Đang tải cửa hàng...</span>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-xl text-text-muted">
              Không tìm thấy cửa hàng nào
            </div>
          ) : (
            filteredStores.map((store) => (
              <div
                key={store.id}
                onMouseEnter={() => setHoveredStoreId(store.id)}
                onMouseLeave={() => setHoveredStoreId(null)}
                onClick={() => handleSelectStore(store)}
                className={cn(
                  "group relative flex flex-col gap-sm rounded-2xl border p-lg transition-all cursor-pointer",
                  selectedStore?.id === store.id
                    ? "border-brand-primary bg-brand-primary/5 shadow-md"
                    : "border-border-primary-50 hover:border-brand-primary/50 hover:bg-surface-muted"
                )}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-body-lg-bold text-text-primary group-hover:text-brand-primary transition-colors">
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

                <div className="mt-sm flex items-center justify-end text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-body-sm-bold mr-1">Chọn cửa hàng này</span>
                  <ChevronRight className="size-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Map View */}
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
                    "flex size-8 items-center justify-center rounded-full border-2 border-white shadow-xl transition-all",
                    isSelected || isHovered ? "bg-brand-primary scale-125 z-20" : "bg-text-primary scale-100 z-10"
                  )}>
                    <MapPin className="size-5 text-white" />
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

        {/* Selected Store Floating Info (Mobile/Quick View) */}
        {selectedStore && (
          <div className="absolute bottom-xl left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[400px]">
            <div className="bg-surface-main p-lg rounded-2xl shadow-2xl border border-brand-primary/20 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-overline text-brand-primary">Đang chọn</span>
                <h3 className="text-body-lg-bold text-text-primary">{selectedStore.name}</h3>
              </div>
              <button 
                onClick={() => router.push("/menu")}
                className="bg-brand-primary text-white px-xl py-md rounded-full text-body-sm-bold shadow-lg hover:shadow-brand-primary/20 transition-all active:scale-95"
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
