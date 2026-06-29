import Link from "next/link";
import { useProducts, DesktopProductCard, ProductCard } from "@/entities/product";
import { AppButton } from "@/shared/ui";
import { useIsMobile, formatToVND } from "@/shared/lib";

export function HomePopularChoices() {
  const isMobile = useIsMobile();
  const { data, isLoading } = useProducts({ limit: 4 });
  const products = data?.data ?? [];

  if (isLoading) {
    return (
      <section className="px-md py-xl lg:px-2xl lg:py-2xl flex flex-col items-center gap-xl">
        <div className="flex flex-col items-center gap-sm text-center max-w-[1152px]">
          <h2 className="text-h1-bold text-text-primary">Our Products</h2>
          <p className="text-body-lg-reg text-text-secondary">Loading...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="px-md py-xl lg:px-2xl lg:py-2xl flex flex-col items-center gap-xl">
      <div className="flex flex-col items-center gap-sm text-center max-w-[1152px]">
        <h2 className="text-h1-bold text-text-primary">Our Products</h2>
        <p className="text-body-lg-reg text-text-secondary">
          Voted by our community of coffee enthusiasts in the Greenwich Village
          collective.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-md gap-y-lg lg:grid-cols-4 lg:gap-xl w-full max-w-[1152px]">
        {products.map((product) =>
          isMobile ? (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.basePrice}
              slug={product.slug}
              imageUrl={product.thumbnail ?? undefined}
            />
          ) : (
            <DesktopProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={formatToVND(product.basePrice)}
              slug={product.slug}
              imageUrl={product.thumbnail ?? undefined}
            />
          ),
        )}
      </div>

      <Link href="/menu">
        <AppButton variant="outline" size="lg">
          View Full Menu
        </AppButton>
      </Link>
    </section>
  );
}
