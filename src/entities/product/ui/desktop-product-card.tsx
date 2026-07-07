import { Plus } from "lucide-react";
import { cn } from "@/shared/lib";
import { AppButton } from "@/shared/ui";
import Link from "next/link";

interface DesktopProductCardProps {
  name: string;
  description: string;
  price: string;
  slug: string;
  imageUrl?: string;
  className?: string;
}

export const DesktopProductCard = ({
  name,
  description,
  price,
  slug,
  imageUrl,
  className,
}: DesktopProductCardProps) => {
  return (
    <div className={cn("flex w-full flex-col gap-md", className)}>
      <div className="relative w-full overflow-hidden rounded-lg bg-surface-muted group" style={{ aspectRatio: '230/282' }}>
        <Link href={`/products/${slug}`} className="block h-full w-full">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          {!imageUrl && <div className="h-full w-full bg-surface-muted" />}
        </Link>
        <Link href={`/products/${slug}`} className="absolute right-md bottom-md">
          <AppButton
            variant="primary"
            size="icon"
            className="size-14 shadow-lg"
            aria-label="Thêm vào giỏ hàng"
          >
            <Plus className="size-8" />
          </AppButton>
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <Link href={`/products/${slug}`} className="flex flex-col gap-1">
          <h4 className="text-body-md-bold text-text-primary leading-tight">
            {name}
          </h4>
          <span className="text-xs text-text-secondary line-clamp-2">
            {description}
          </span>
        </Link>
        <span className="text-body-sm-bold text-brand-primary pt-1 shrink-0">
          {price}
        </span>
      </div>
    </div>
  );
};
