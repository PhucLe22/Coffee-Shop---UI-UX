"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { AppButton } from "@/shared/ui";
import { ProductCard } from "@/entities/product";
import { useIsMobile } from "@/shared/lib";

import { HomeHero } from "@/widgets/home-hero";
import { HomeRituals } from "@/widgets/home-rituals";
import { HomePopularChoices } from "@/widgets/home-popular-choices";

export default function Home() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isMobile) {
    return (
      <div className="flex flex-col bg-surface-main">
        <HomeHero />
        <HomeRituals />
        <HomePopularChoices />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-surface-main">
      <main className="flex flex-col gap-xl px-md pt-md">
        {/* Branch Selector & Search */}
        <section className="flex flex-col gap-md">
          <div className="flex flex-col gap-1">
            <span className="font-inter text-body-sm-semibold text-text-secondary">
              Currently Serving At
            </span>
            <button className="flex items-center justify-between gap-2">
              <h2 className="text-h2-bold text-text-primary">
                Greenwich Village
              </h2>
              <ChevronDown className="size-4 text-text-primary" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-4 size-6 -translate-y-1/2 text-text-muted/50" />
            <input
              type="text"
              placeholder="Search your ritual..."
              className="h-14 w-full rounded-full bg-surface-muted pl-12 pr-4 font-plus-jakarta text-[16px] font-bold text-text-primary placeholder:text-text-muted/50 focus:outline-none"
            />
          </div>
        </section>

        {/* Featured Rituals */}
        <section className="flex flex-col gap-lg">
          <h2 className="text-h2-bold text-text-secondary">Featured Rituals</h2>
          <div className="flex flex-col gap-lg">
            {/* Large Featured Card */}
            <div className="relative aspect-357/400 w-full overflow-hidden rounded-lg bg-text-primary">
              <div className="absolute inset-0 bg-linear-to-t from-text-primary/90 via-text-primary/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-lg">
                <div className="mb-sm flex w-fit items-center rounded-full bg-brand-primary px-3 py-1 text-[10px] font-bold text-inverse-text">
                  NEW SEASON
                </div>
                <h3 className="mb-sm font-plus-jakarta text-[48px] font-extrabold leading-[1.2] text-brand-primary">
                  The Honey- Oak Flat White
                </h3>
                <p className="mb-md font-inter text-[16px] font-bold text-inverse-text">
                  Sourced from the highlands of Ethiopia, infused with
                  sustainable forest honey.
                </p>
                <AppButton className="w-fit">Try it now</AppButton>
              </div>
            </div>

            {/* Accent Promo Card */}
            <div className="flex flex-col gap-md rounded-lg bg-brand-primary p-lg text-inverse-text">
              <div className="flex flex-col gap-1">
                <h3 className="font-plus-jakarta text-[36px] font-extrabold leading-tight">
                  Monday Roast
                </h3>
                <span className="font-plus-jakarta text-[18px] font-bold">
                  50% Off
                </span>
              </div>
              <p className="font-inter text-body-sm-semibold">
                Exclusive for rewards members every first day of the week.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Choices */}
        <section className="flex flex-col gap-lg pb-10">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-h2-bold text-text-secondary leading-tight">
                Popular
                <br />
                Choices
              </h2>
              <p className="font-inter text-[16px] text-text-muted">
                Hand-picked favorites by our
                <br />
                local baristas.
              </p>
            </div>
            <button className="flex h-14 w-21 items-center justify-center border-b border-brand-primary px-2 text-center font-inter text-[16px] font-bold text-text-primary leading-tight">
              View full
              <br />
              menu
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            <ProductCard
              name="Cold Brew Nitro"
              size="350ml"
              price="$5.50"
              slug="cold-brew-nitro"
              imageUrl="https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1974&auto=format&fit=crop"
            />
            <ProductCard
              name="Double Espresso"
              size="350ml"
              price="$5.50"
              slug="double-espresso"
              imageUrl="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=1970&auto=format&fit=crop"
            />
            <ProductCard
              name="Caramel Macchiato"
              size="350ml"
              price="$5.50"
              slug="caramel-macchiato"
              imageUrl="https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1974&auto=format&fit=crop"
            />
            <ProductCard
              name="Oatmilk Latte"
              size="350ml"
              price="$5.50"
              slug="oatmilk-latte"
              imageUrl="https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1974&auto=format&fit=crop"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
