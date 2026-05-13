import { Plus } from "lucide-react";
import { cn } from "@/shared/lib";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  size: string;
  price: string;
  slug: string;
  imageUrl?: string;
  className?: string;
}

export const ProductCard = ({
  name,
  size,
  price,
  slug,
  imageUrl,
  className,
}: ProductCardProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-sm", className)}>
      {/* Product Image & Add Button */}
      <div className="relative aspect-[160/220] w-full overflow-hidden rounded-md bg-surface-accent">
        <Link href={`/products/${slug}`} className="block h-full w-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          )}
        </Link>
        <button
          className="absolute right-2 bottom-2 flex size-10 items-center justify-center rounded-md bg-brand-primary text-inverse-text shadow-smeffect transition-all hover:bg-brand-accent active:scale-90"
          aria-label="Add to cart">
          <Plus className="size-6" />
        </button>
      </div>

      {/* Product Info */}
      <Link href={`/products/${slug}`} className="flex flex-col">
        <h4 className="text-h4-bold line-clamp-2 h-14 w-full text-text-primary">
          {name}
        </h4>
        <div className="flex items-center justify-between text-body-md-bold">
          <span className="text-text-secondary">{size}</span>
          <span className="text-brand-primary">{price}</span>
        </div>
      </Link>
    </div>
  );
};
