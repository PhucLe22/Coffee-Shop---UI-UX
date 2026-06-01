import { Plus } from "lucide-react";
import { cn } from "@/shared/lib";
import Link from "next/link";

interface ProductCardDetailedProps {
  name: string;
  price: string;
  description: string;
  calories: string;
  size: string;
  slug: string;
  imageUrl?: string;
  badge?: string;
  className?: string;
}

export const ProductCardDetailed = ({
  name,
  price,
  description,
  calories,
  size,
  slug,
  imageUrl,
  badge,
  className,
}: ProductCardDetailedProps) => {
  return (
    <div className={cn("flex w-full flex-col overflow-hidden rounded-md bg-inverse-text", className)}>
      {/* Product Image & Badge */}
      <div className="relative aspect-[358/256] w-full overflow-hidden bg-surface-accent">
        <Link href={`/products/${slug}`} className="block h-full w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
             <div className="h-full w-full bg-surface-muted flex items-center justify-center text-text-muted">
                No Image
             </div>
          )}
        </Link>
        {badge && (
          <div className="absolute right-4 top-2 rounded-full bg-brand-primary px-2 py-0.5 text-overline text-inverse-text">
            {badge}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-6 gap-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
                <h4 className="text-h4-bold text-text-primary flex-1 pr-2">
                    {name}
                </h4>
                <span className="text-h5-bold text-brand-primary">{price}</span>
            </div>
            <p className="text-body-sm-reg text-text-secondary line-clamp-2 min-h-[46px]">
                {description}
            </p>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <span className="label-overline-inter text-text-secondary uppercase tracking-widest">
                    {calories} KCAL • {size} OZ
                </span>
            </div>
            <Link
                href={`/products/${slug}`}
                className="flex size-10 items-center justify-center rounded-md bg-brand-primary text-inverse-text shadow-sm transition-all hover:bg-brand-accent active:scale-90"
                aria-label="Add to cart"
            >
                <Plus className="size-6" />
            </Link>
        </div>
      </div>
    </div>
  );
};
