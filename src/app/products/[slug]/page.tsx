import { products } from "@/shared/api/mock/data";
import { STATIC_PLACEHOLDER_PARAM } from "@/shared/lib/static-route-param";
import { ProductDetailView } from "./product-detail-view";

// Pre-render demo products (+ a placeholder for products created at runtime) for the static export.
export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") return [];
  return [...products.map((p) => ({ slug: p.slug })), { slug: STATIC_PLACEHOLDER_PARAM }];
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailView slugParam={slug} />;
}
