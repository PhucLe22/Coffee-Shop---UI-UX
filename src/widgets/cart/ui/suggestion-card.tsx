"use client";

import { cn, formatToVND } from "@/shared/lib";
import { Plus } from "lucide-react";
import Link from "next/link";

interface SuggestionCardProps {
  name: string;
  price: number;
  imageUrl?: string;
  slug: string;
  className?: string;
}

export function SuggestionCard({
  name,
  price,
  imageUrl,
  slug,
  className,
}: SuggestionCardProps) {
  return (
    <div className={cn("flex flex-col gap-md min-w-[294px]", className)}>
      <div className="group relative aspect-[294/286] w-full overflow-hidden rounded-md bg-surface-accent">
        <Link href={`/products/${slug}`} className="block h-full w-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Link>
        <button
          className="absolute right-2 bottom-2 flex size-10 items-center justify-center rounded-2xl bg-brand-primary text-inverse-text shadow-smeffect transition-all hover:bg-brand-accent active:scale-90"
          aria-label="Thêm vào giỏ hàng"
        >
          <Plus className="size-6" />
        </button>
      </div>

      <div className="flex flex-col gap-xs">
        <h4 className="text-body-sm-semibold text-text-primary uppercase tracking-tight">
          {name}
        </h4>
        <span className="text-body-md-bold text-brand-primary">
          {formatToVND(price)}
        </span>
      </div>
    </div>
  );
}
