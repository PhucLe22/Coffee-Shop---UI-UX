"use client";

import React, { useState } from "react";
import { 
  Search, 
  Trash2,
  Plus,
  Minus,
  Tag,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { useIsMobile, formatToVND } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import { useInternalCartStore, InternalCartItem, useCreateStaffOrder } from "@/entities/order";
import { DesktopProductCard, ProductCardDetailed, useProducts } from "@/entities/product";
import { InternalOrderOptionModal } from "@/widgets/internal-order-create/ui/internal-order-option-modal";
import { useInfiniteProducts } from "@/entities/product";
import { Skeleton } from "@/shared/ui/skeleton";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/shared/ui/sheet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OrderType } from "@/shared/api";

// Temporary mock data for categories
const CATEGORIES = ["ALL", "COFFEE", "TEA", "BAKERY", "NON-COFFEE"];

interface CartContentItemsProps {
  items: InternalCartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContentItems = ({ items, updateQuantity }: CartContentItemsProps) => (
  <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
    {items.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-md opacity-50">
        <ShoppingBag className="size-16 stroke-[1]" />
        <p className="text-body-md-semibold">Your cart is empty</p>
      </div>
    ) : (
      items.map((item) => (
        <div key={item.id} className="flex gap-md bg-white/50 p-md rounded-lg border border-border-primary-50/5 shadow-sm">
          <div className="size-20 rounded-md bg-surface-muted overflow-hidden shrink-0">
            {item.image && <img src={item.image} alt={item.name} className="size-full object-cover" />}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-body-md-bold text-text-primary line-clamp-1">{item.name}</h4>
              <p className="text-[11px] text-text-muted">
                {item.options?.size}{item.options?.milk !== "None" ? `, ${item.options?.milk}` : ""}{item.options?.toppings && item.options.toppings.length > 0 ? `, ${item.options.toppings.join(", ")}` : ""}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-md-bold text-brand-primary">{formatToVND(item.price)}</span>
              <div className="flex items-center gap-sm bg-surface-muted rounded-full px-2 py-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="size-6 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                  <Minus className="size-3" />
                </button>
                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="size-6 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);

interface OrderSummaryFooterProps {
  getSubtotal: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  onPlaceOrder: () => void;
  isPending: boolean;
}

const OrderSummaryFooter = ({ getSubtotal, getDiscount, getTotal, onPlaceOrder, isPending }: OrderSummaryFooterProps) => (
  <div className="p-lg flex flex-col gap-md bg-[#faf2eb] border-t border-border-primary-50/10">
    <div className="flex flex-col gap-sm">
      <div className="flex justify-between text-body-sm-reg text-text-primary">
        <span>Subtotal</span>
        <span>{formatToVND(getSubtotal())}</span>
      </div>
      <div className="flex justify-between text-body-sm-reg text-[#386661]">
        <span>Discount</span>
        <span>-{formatToVND(getDiscount())}</span>
      </div>
      <Separator className="my-sm opacity-10" />
      <div className="flex justify-between items-end">
        <span className="text-h3-bold text-text-secondary">Total</span>
        <span className="text-h2-bold text-text-primary">{formatToVND(getTotal())}</span>
      </div>
    </div>

    <div className="flex flex-col gap-sm mt-md">
       <div className="flex flex-col gap-2">
         <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Promo Code</label>
         <div className="flex gap-2">
           <Input placeholder="Enter code" className="bg-white border-none rounded-md" />
           <Button variant="outline" className="rounded-md px-lg font-bold text-xs">APPLY</Button>
         </div>
       </div>
       <Button 
         onClick={onPlaceOrder}
         disabled={isPending}
         className="w-full h-14 bg-brand-primary text-white font-extrabold text-[13px] tracking-widest shadow-lg shadow-brand-primary/20 rounded-full mt-md"
       >
         {isPending ? "PLACING ORDER..." : "PLACE ORDER"}
       </Button>
    </div>
  </div>
);

export default function InternalOrderCreatePage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState("");
  
  const { data: productsData, isLoading } = useProducts({});
  const products = productsData?.data || [];

  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getSubtotal, 
    getDiscount, 
    getTotal,
    clearCart
  } = useInternalCartStore();

  const { mutate: createStaffOrder, isPending: isCreatingOrder } = useCreateStaffOrder();

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (!customerSearch) {
      toast.error("Please enter customer phone number");
      return;
    }

    if (orderType === OrderType.DINE_IN && !tableNumber) {
      toast.error("Please enter table number");
      return;
    }

    const orderData = {
      type: orderType,
      tableNumber: orderType === OrderType.DINE_IN ? tableNumber : undefined,
      phone: customerSearch,
      note: "Staff creating order for customer",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        options: item.selectedOptionIds?.map(id => ({ optionId: id })) || [],
      })),
    };

    createStaffOrder(orderData, {
      onSuccess: (response) => {
        toast.success("Order created successfully!");
        clearCart();
        if (response.data.orderCode) {
          router.push(`/internal/orders`); 
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to create order");
      },
    });
  };

  const filteredProducts = products.filter((p: any) => 
    (activeCategory === "ALL" || p.category.name.toUpperCase() === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-surface-main relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-md md:p-lg gap-lg overflow-y-auto pb-32 md:pb-lg">
        <div className="flex flex-col gap-sm">
          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Store Operations</span>
          <h1 className="text-h2-bold text-text-primary">Create New Order</h1>
        </div>

        {/* Order Type & Customer Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <div className="flex flex-col gap-md p-md bg-[#faf2eb]/50 rounded-xl border border-border-primary-50/10 shadow-sm">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Order Type</span>
            <div className="flex gap-md">
              <button
                onClick={() => setOrderType(OrderType.DINE_IN)}
                className={cn(
                  "flex-1 py-2 rounded-lg font-bold text-xs transition-all",
                  orderType === OrderType.DINE_IN
                    ? "bg-brand-primary text-white shadow-md"
                    : "bg-white text-text-muted hover:text-text-primary"
                )}
              >
                DINE IN
              </button>
              <button
                onClick={() => setOrderType(OrderType.TAKEAWAY)}
                className={cn(
                  "flex-1 py-2 rounded-lg font-bold text-xs transition-all",
                  orderType === OrderType.TAKEAWAY
                    ? "bg-brand-primary text-white shadow-md"
                    : "bg-white text-text-muted hover:text-text-primary"
                )}
              >
                TAKEAWAY
              </button>
            </div>
            {orderType === OrderType.DINE_IN && (
              <Input 
                placeholder="Table Number (e.g. A10)" 
                className="h-10 bg-white border-none rounded-md text-sm shadow-none focus-visible:ring-1 focus-visible:ring-brand-primary/20"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col gap-md p-md bg-[#faf2eb]/50 rounded-xl border border-border-primary-50/10 shadow-sm">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Customer Selection</span>
            <div className="flex gap-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <Input 
                  placeholder="Search by name or phone..." 
                  className="pl-9 h-10 bg-white border-none rounded-md text-sm shadow-none focus-visible:ring-1 focus-visible:ring-brand-primary/20"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-10 px-md text-xs font-bold rounded-md border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5">NEW CUSTOMER</Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-md">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Product Selection</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 h-12 bg-white border-none rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-brand-primary/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-sm overflow-x-auto no-scrollbar pb-xs">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full h-9 px-lg text-[11px] font-extrabold tracking-widest transition-all",
                  activeCategory === cat 
                    ? "bg-text-primary text-white shadow-md" 
                    : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md md:gap-lg">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[230/380] w-full rounded-lg" />
            ))
          ) : (
            filteredProducts.map((product: any) => (
              <div key={product.id} onClick={() => setSelectedProductSlug(product.slug)} className="cursor-pointer group">
                {isMobile ? (
                  <ProductCardDetailed
                    name={product.name}
                    price={formatToVND(product.basePrice)}
                    description={product.description}
                    calories="150"
                    size="12"
                    slug={product.slug}
                    imageUrl={product.thumbnail || undefined}
                    className="pointer-events-none group-hover:shadow-lg transition-all"
                  />
                ) : (
                  <DesktopProductCard
                    name={product.name}
                    description={product.description}
                    price={formatToVND(product.basePrice)}
                    slug={product.slug}
                    imageUrl={product.thumbnail || undefined}
                    className="pointer-events-none group-hover:translate-y-[-4px] transition-all"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Option Selection Modal */}
      {selectedProductSlug && (
        <InternalOrderOptionModal 
          key={selectedProductSlug}
          productSlug={selectedProductSlug} 
          onClose={() => setSelectedProductSlug(null)} 
        />
      )}

      {/* Sidebar Summary (Desktop) */}
      {!isMobile && (
        <aside className="w-[400px] xl:w-[450px] bg-surface-accent border-l border-border-primary-50/10 flex flex-col sticky top-0 h-screen shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-lg flex items-center justify-between border-b border-border-primary-50/10 bg-[#faf2eb]/50 backdrop-blur-md">
            <h2 className="text-h4-bold text-text-primary">Order Summary</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-text-muted hover:text-error hover:bg-error/10"
              onClick={clearCart}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>

          <CartContentItems items={items} updateQuantity={updateQuantity} />
          <OrderSummaryFooter 
            getSubtotal={getSubtotal} 
            getDiscount={getDiscount} 
            getTotal={getTotal} 
            onPlaceOrder={handlePlaceOrder}
            isPending={isCreatingOrder}
          />
        </aside>
      )}

      {/* Mobile Sticky Footer & Cart Sheet */}
      {isMobile && items.length > 0 && (
        <>
          <div className="fixed bottom-[87px] left-0 right-0 p-md bg-[#faf2eb] border-t border-border-primary-50/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex items-center justify-between z-[50] animate-in slide-in-from-bottom duration-300">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Amount</span>
              <span className="text-h3-bold text-text-primary">{formatToVND(getTotal())}</span>
            </div>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button className="rounded-full px-xl h-12 bg-brand-primary text-white font-bold tracking-widest text-[12px] shadow-lg shadow-brand-primary/20">
                  VIEW CART ({items.length})
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] p-0 flex flex-col bg-[#fff8f3] border-none shadow-2xl">
                <SheetHeader className="p-lg border-b border-border-primary-50/5">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-h3-bold text-text-primary">Order Summary</SheetTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-text-muted hover:text-error"
                      onClick={clearCart}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </SheetHeader>
                <CartContentItems items={items} updateQuantity={updateQuantity} />
                <OrderSummaryFooter 
                  getSubtotal={getSubtotal} 
                  getDiscount={getDiscount} 
                  getTotal={getTotal} 
                  onPlaceOrder={handlePlaceOrder}
                  isPending={isCreatingOrder}
                />
              </SheetContent>
            </Sheet>
          </div>
        </>
      )}
    </div>
  );
}
