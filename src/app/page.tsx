"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { ProductCard } from "@/entities/product";
import { useIsMobile } from "@/shared/lib";

import { HomeHero } from "@/widgets/home-hero";
import { HomeRituals } from "@/widgets/home-rituals";
import { HomePopularChoices } from "@/widgets/home-popular-choices";
import { useStoreStore } from "@/entities/store";
import { AIChatButton } from "@/widgets/ai-chat-button";
import Link from "next/link";

export default function HomePage() {
  const isMobile = useIsMobile();
  const { selectedStore } = useStoreStore();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col bg-surface-main min-h-screen relative">
      {!isMobile ? (
        <div className="flex flex-col">
          <HomeHero />
          <HomePopularChoices />
          <HomeRituals />
        </div>
      ) : (
        <main className="flex flex-col gap-xl px-md py-md">
        {/* Branch Selector & Search */}
        <section className="flex flex-col gap-lg">
          <div className="flex flex-col gap-1">
            <span className="text-body-sm-semibold text-text-secondary">
              Hiện đang phục vụ tại
            </span>
            <Link href="/locations" className="flex items-center justify-between w-full">
              <h2 className="text-display-md text-text-primary leading-tight">
                {selectedStore?.name || "Chọn cửa hàng"}
              </h2>
              <ChevronDown className="size-6 text-text-primary shrink-0" />
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-lg size-6 -translate-y-1/2 text-text-muted/50" />
            <input
              type="text"
              placeholder="Tìm kiếm món uống của bạn..."
              className="h-14 w-full rounded-full bg-inverse-text pl-12 pr-4 text-body-md-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none shadow-sm"
            />
          </div>
        </section>

        {/* Featured Rituals */}
        <section className="flex flex-col gap-lg">
          <h2 className="text-h1-bold text-text-secondary">Featured Rituals</h2>
          <div className="flex flex-col gap-lg">
            {/* Large Featured Card */}
            <div className="relative min-h-[400px] w-full overflow-hidden rounded-lg bg-text-primary shadow-lg">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
              <div className="absolute inset-0 bg-linear-to-t from-text-primary/95 via-text-primary/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-xl gap-md">
                <div className="flex w-fit items-center rounded-full bg-brand-primary px-lg py-1 text-overline-inter text-inverse-text uppercase">
                  NEW SEASON
                </div>
                <h3 className="text-display-md text-brand-primary leading-tight">
                  The Honey- Oak Flat White
                </h3>
                <p className="text-body-md-bold text-inverse-text">
                  Sourced from the highlands of Ethiopia, infused with
                  sustainable forest honey.
                </p>
                <AppButton variant="secondary" className="w-fit">Try it now</AppButton>
              </div>
            </div>

            {/* Accent Promo Card */}
            <div className="flex flex-col gap-lg rounded-lg bg-brand-primary p-xl text-inverse-text shadow-lg">
              <div className="flex flex-col gap-1">
                <h3 className="text-display-md text-inverse-text leading-tight">
                  Monday Roast
                </h3>
                <span className="text-h3-bold text-inverse-text">
                  50% Off
                </span>
              </div>
              <p className="text-body-sm-semibold">
                Exclusive for rewards members every first day of the week.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Choices */}
        <section className="flex flex-col gap-lg pb-xl">
          <div className="flex items-end justify-between gap-md">
            <div className="flex flex-col gap-2">
              <h2 className="text-h1-bold text-text-secondary leading-tight">
                Popular<br />Choices
              </h2>
              <p className="text-body-md-reg text-text-muted">
                Hand-picked favorites by our local baristas.
              </p>
            </div>
            <button className="flex h-14 shrink-0 items-center justify-center border-b border-brand-primary px-xs text-center text-body-md-bold text-text-primary leading-tight">
              View full<br />menu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-md gap-y-xl">
            <ProductCard
              name="Cold Brew Nitro"
              size="350ml"
              price={55000}
              slug="cold-brew-nitro"
              imageUrl="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1974&auto=format&fit=crop"
            />
            <ProductCard
              name="Double Espresso"
              size="350ml"
              price={55000}
              slug="double-espresso"
              imageUrl="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1970&auto=format&fit=crop"
            />
            <ProductCard
              name="Caramel Macchiato"
              size="350ml"
              price={55000}
              slug="caramel-macchiato"
              imageUrl="https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1974&auto=format&fit=crop"
            />
            <ProductCard
              name="Oatmilk Latte"
              size="350ml"
              price={55000}
              slug="oatmilk-latte"
              imageUrl="https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1974&auto=format&fit=crop"
            />
          </div>
        </section>
      </main>
      )}
      <AIChatButton />
    </div>
  );
}
