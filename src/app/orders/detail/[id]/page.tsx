import { orders } from "@/shared/api/mock/data";
import { STATIC_PLACEHOLDER_PARAM } from "@/shared/lib/static-route-param";
import { OrderDetailView } from "./order-detail-view";

// Pre-render demo orders (+ a placeholder for orders placed at runtime) for the static export.
export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") return [];
  return [...orders.map((o) => ({ id: o.orderCode })), { id: STATIC_PLACEHOLDER_PARAM }];
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailView idParam={id} />;
}
