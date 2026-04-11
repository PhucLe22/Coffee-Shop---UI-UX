"use client";

import { useState } from "react";
import { useIsMobile } from "@/shared/lib";
import {
  DesktopCartItem,
  DesktopCartSummary,
  SuggestionSection,
} from "@/widgets/cart";
import { AuthModal } from "@/widgets/auth";
import { useCartStore } from "@/entities/cart";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { AppButton } from "@/shared/ui";

export default function CartPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { items, updateQuantity, removeItem } = useCartStore();
  const { user } = useAuthStore();

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    console.log("Proceed to checkout");
  };

  const handleNavigate = (path: string) => {
    setIsAuthModalOpen(false);
    router.push(path);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 8.0;
  const tax = 0.0;
  const total = subtotal + shipping + tax;

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNavigate={handleNavigate}
      />
      {/* ... rest of the page components */}
      {!isMobile ? (
        <main className="min-h-screen bg-[#faf2eb] pb-3xl">
          <div className="container mx-auto px-2xl py-xl">
            <div className="grid grid-cols-12 gap-xl">
              <div className="col-span-8 flex flex-col gap-lg">
                <div className="flex flex-col gap-md">
                  {items.map((item) => (
                    <DesktopCartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-3xl bg-[#ebe0d9] rounded-md border border-dashed border-text-muted/30">
                      <p className="text-h3-bold text-text-muted">Your cart is empty</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-4">
                <div className="sticky top-[120px]">
                  <DesktopCartSummary
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                    onCheckout={handleCheckout}
                    onApplyPromo={(code) => console.log("Apply promo", code)}
                  />
                </div>
              </div>
            </div>
            <SuggestionSection className="mt-3xl" />
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-surface-main pb-2xl px-md pt-md flex flex-col gap-lg">
          <h1 className="text-h2-bold text-text-primary">Giỏ hàng</h1>
          {/* ... mobile version ... */}
          <AppButton variant="primary" className="w-full h-[54px] mt-md" onClick={handleCheckout}>
            Thanh toán
          </AppButton>
          <SuggestionSection className="mt-xl" />
        </main>
      )}
    </>
  );
}
