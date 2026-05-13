import { OrderHistory } from "./order-history";
import { OrderSuggestions } from "./order-suggestions";
import { Order } from "@/entities/order";

const DUMMY_ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "#VA-8472",
    status: "delivered",
    createdAt: "Yesterday, 10:20",
    estimatedArrival: "",
    estimatedArrivalText: "Delivered at: 123 Lê Lợi, Q.1",
    totalPrice: 65000,
    items: [{ id: "p1", name: "Flat White", quantity: 2, price: 30000 }],
  },
  {
    id: "2",
    orderNumber: "#VA-8829",
    status: "in_process",
    createdAt: "Today, 14:20",
    estimatedArrival: "",
    estimatedArrivalText: "10% sugar, 10% ice",
    totalPrice: 145000,
    items: [
      { id: "p1", name: "Flat White", quantity: 2, price: 30000 },
      { id: "p2", name: "Croissant", quantity: 1, price: 45000 },
    ],
  },
  {
    id: "3",
    orderNumber: "#VA-8829",
    status: "cancelled",
    createdAt: "Today, 14:20",
    estimatedArrival: "",
    estimatedArrivalText: "10% sugar, 10% ice",
    totalPrice: 145000,
    items: [
      { id: "p1", name: "Flat White", quantity: 2, price: 30000 },
      { id: "p2", name: "Croissant", quantity: 1, price: 45000 },
    ],
  },
  {
    id: "4",
    orderNumber: "#VA-8829",
    status: "placed",
    createdAt: "Today, 14:20",
    estimatedArrival: "",
    estimatedArrivalText: "10% sugar, 10% ice",
    totalPrice: 145000,
    items: [
      { id: "p1", name: "Flat White", quantity: 2, price: 30000 },
      { id: "p2", name: "Croissant", quantity: 1, price: 45000 },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-accent">
      {/* Main Content */}
      <main className="flex flex-col gap-xl p-md">
        <OrderHistory orders={DUMMY_ORDERS} />
        <OrderSuggestions />
      </main>
    </div>
  );
}
