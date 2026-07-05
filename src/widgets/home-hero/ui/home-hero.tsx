'use client';

import { MapPin, Play } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { useStoreStore, useStores } from "@/entities/store";
import Link from "next/link";
import { useEffect } from "react";

export function HomeHero() {
  const { selectedStore, setSelectedStore } = useStoreStore();
  const { data: storesResponse } = useStores();
  const stores = storesResponse?.data || [];

  useEffect(() => {
    if (stores.length > 0) {
      const storedStore = selectedStore;
      const stillExists = storedStore && stores.some(s => s.id === storedStore.id);
      if (!stillExists) {
        setSelectedStore(stores[0]);
      }
    }
  }, [stores, selectedStore, setSelectedStore]);

  return (
    <section className="px-2xl py-2xl flex items-center justify-between min-h-[900px] gap-2xl">
      <div className="flex-1 flex flex-col gap-xl max-w-[608px]">
        <Link 
          href="/locations" 
          className="flex items-center gap-sm hover:opacity-80 transition-opacity w-fit"
        >
          <MapPin className="size-6 text-text-secondary" />
          <span className="text-body-md-bold text-text-secondary uppercase">
            {selectedStore ? `${selectedStore.name}, ${selectedStore.address}` : "CHỌN CỬA HÀNG PHỤC VỤ"}
          </span>
        </Link>

        <h1 className="text-display-lg text-text-primary leading-[1.1]">
          The Honey-Oak
          <br />
          Flat White
        </h1>

        <p className="text-body-lg-reg text-text-secondary">
          Sự kết hợp tinh tế giữa mật ong hoa dại ép lạnh và sữa phong vị gỗ sồi. Nghi thức buổi sáng được tái định nghĩa.
        </p>

        <div className="flex items-center gap-md">
          <AppButton variant="primary">TÙY CHỈNH NGAY</AppButton>
          <AppButton variant="outline" className="gap-sm">
            <Play className="size-5 fill-text-primary" />
            Câu Chuyện Pha Chế
          </AppButton>
        </div>
      </div>

      <div className="flex-1 relative max-w-[608px] h-[730px]">
        <div className="w-full h-full rounded-lg bg-surface-muted overflow-hidden">
          {/* Placeholder for actual image */}
          <div className="w-full h-full bg-[url('https://i.pinimg.com/736x/ee/f2/37/eef23753ef5ce2b33148cb628aa9d443.jpg?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        {/* Info Card Overlay */}
        <div className="absolute bottom-md left-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-md p-md w-[307px] shadow-lg">
          <h3 className="text-h4-bold text-inverse-text mb-sm">
            Estate Series No. 24
          </h3>
          <p className="text-body-sm-reg text-inverse-text opacity-80">
            Hạt cà phê đơn nguồn từ vùng Sidama, Ethiopia. Được rang thủ công mỗi tuần.
          </p>
        </div>
      </div>
    </section>
  );
}
