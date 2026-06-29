"use client";

import { useState, useEffect } from "react";
import { useIsMobile, cn, formatToVND } from "@/shared/lib";
import {
  DesktopCartItem,
  MobileCartItem,
  DesktopCartSummary,
  SuggestionSection,
} from "@/widgets/cart";
import { AuthModal } from "@/widgets/auth";
import { useCartStore } from "@/entities/cart";
import { useCustomerAuthStore } from "@/shared/auth";
import { useStoreStore } from "@/entities/store";
import { useRouter } from "next/navigation";
import { Minus, Plus, MapPin, ChevronRight } from "lucide-react";
import { AppButton, Input, Label } from "@/shared/ui";
import { useCreateOrder } from "@/entities/order";
import { OrderType } from "@/shared/api";
import { useStores } from "@/entities/store";
import { useAddresses } from "@/entities/customer";
import { toast } from "sonner";
import Link from "next/link";
import { CreateAddressDialog } from "../profile/create-address-dialog";

export default function CartPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useCustomerAuthStore();
  const { data: storesResponse } = useStores();
  const { data: addressesResponse } = useAddresses();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const stores = storesResponse?.data || [];
  const addresses = addressesResponse?.data || [];

  const [orderType, setOrderType] = useState<OrderType>(OrderType.DELIVERY);
  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: "",
    receiverPhone: "",
    addressLine: "",
  });

  // Automatically select the first store if none selected
  useEffect(() => {
    if (!selectedStore && stores.length > 0) {
      setSelectedStore(stores[0]);
    }
  }, [stores, selectedStore, setSelectedStore]);

  // Prefill default address
  useEffect(() => {
    if (user && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setDeliveryInfo({
        receiverName: defaultAddr.receiverName,
        receiverPhone: defaultAddr.receiverPhone,
        addressLine: defaultAddr.addressLine,
      });
    } else if (user) {
      setDeliveryInfo((prev) => ({
        ...prev,
        receiverName: prev.receiverName || user.name || "",
        receiverPhone: prev.receiverPhone || user.phone || "",
      }));
    }
  }, [user, addresses]);

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

    if (items.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return;
    }

    if (orderType === OrderType.DELIVERY) {
      if (
        !deliveryInfo.receiverName ||
        !deliveryInfo.receiverPhone ||
        !deliveryInfo.addressLine
      ) {
        toast.error("Vui lòng nhập đầy đủ thông tin giao hàng");
        return;
      }
    }

    if (!selectedStore) {
      toast.error("Vui lòng chọn cửa hàng phục vụ");
      return;
    }

    const orderData = {
      storeId: selectedStore.id,
      type: orderType,
      deliveryInfo:
        orderType === OrderType.DELIVERY ? deliveryInfo : undefined,
      note: "Customer order from web cart",
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        note: item.note,
        options: item.options.map((opt) => ({
          optionId: opt.optionId,
        })),
      })),
    };

    createOrder(orderData, {
      onSuccess: (response) => {
        toast.success("Đặt hàng thành công!");
        clearCart();
        if (response.data.orderCode) {
          router.push(`/orders/detail/${response.data.orderCode}`);
        } else {
          router.push("/orders");
        }
      },
      onError: (error) => {
        toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        console.error("Order creation failed:", error);
      },
    });
  };

  const handleNavigate = (path: string) => {
    setIsAuthModalOpen(false);
    router.push(path);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = orderType === OrderType.DELIVERY ? 15000 : 0;
  const tax = subtotal * 0.08; // 8% VAT
  const total = subtotal + shipping + tax;

  const handleSelectSavedInfo = (addressId: string) => {
    const selected = addresses.find((addr) => addr.id === addressId);
    if (selected) {
      setDeliveryInfo({
        receiverName: selected.receiverName,
        receiverPhone: selected.receiverPhone,
        addressLine: selected.addressLine,
      });
    }
  };

  const AddressSelectionSection = () => (
    <div className={cn(
      "p-xl rounded-md flex flex-col gap-md",
      !isMobile ? "bg-surface-muted" : "bg-surface-muted"
    )}>
      <div className="flex items-center justify-between">
        <h3 className={cn(
          "font-bold font-plus-jakarta",
          !isMobile ? "text-[20px]" : "text-body-lg-bold"
        )}>
          Địa chỉ giao hàng
        </h3>
        <Link href="/profile" className="text-body-sm-bold text-brand-primary hover:underline flex items-center gap-1">
          Quản lý <ChevronRight className="size-3" />
        </Link>
      </div>
      
      {user && addresses.length > 0 ? (
        <div className="flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">CHỌN ĐỊA CHỈ ĐÃ LƯU</Label>
            <CreateAddressDialog 
              trigger={
                <button className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-1">
                  <Plus className="size-3" /> THÊM ĐỊA CHỈ MỚI
                </button>
              }
              onCreated={(newAddr) => {
                setDeliveryInfo({
                  receiverName: newAddr.receiverName,
                  receiverPhone: newAddr.receiverPhone,
                  addressLine: newAddr.addressLine,
                });
              }}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-md top-1/2 -translate-y-1/2 size-4 text-brand-primary" />
            <select 
              className="h-14 w-full rounded-md bg-surface-accent pl-11 pr-md py-sm text-body-md-reg text-text-primary focus:outline-none border-none appearance-none"
              onChange={(e) => handleSelectSavedInfo(e.target.value)}
              value={addresses.find(a => a.addressLine === deliveryInfo.addressLine)?.id || ""}
            >
              {addresses.map(addr => (
                <option key={addr.id} value={addr.id}>
                  [{addr.label.toUpperCase()}] {addr.addressLine}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-sm">
           <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">ĐỊA CHỈ NHẬN HÀNG</Label>
           <div className="relative">
             <MapPin className="absolute left-md top-1/2 -translate-y-1/2 size-4 text-brand-primary" />
             <Input
                placeholder="Nhập địa chỉ của bạn..."
                value={deliveryInfo.addressLine}
                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, addressLine: e.target.value })}
                className="h-14 pl-11 bg-surface-accent border-none"
              />
           </div>
           {!user && (
             <p className="text-overline text-text-muted italic">Đăng nhập để chọn địa chỉ đã lưu</p>
           )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNavigate={handleNavigate}
      />
      
      {!isMobile ? (
        <main className="min-h-screen bg-surface-accent pb-3xl">
          <div className="container mx-auto px-2xl py-xl">
            <div className="grid grid-cols-12 gap-xl">
              <div className="col-span-8 flex flex-col gap-lg">
                <AddressSelectionSection />

                <div className={cn(
                  "p-xl rounded-md flex flex-col gap-lg bg-surface-muted"
                )}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold font-plus-jakarta text-[20px]">
                      Hình thức đơn hàng
                    </h3>
                    <div className="flex bg-surface-accent p-1 rounded-full border border-black/5">
                      <button
                        onClick={() => setOrderType(OrderType.DELIVERY)}
                        className={cn(
                          "px-6 py-2 rounded-full font-bold transition-all text-[13px]",
                          orderType === OrderType.DELIVERY
                            ? "bg-brand-primary text-inverse-text shadow-sm"
                            : "text-text-muted hover:text-text-primary"
                        )}
                      >
                        GIAO HÀNG
                      </button>
                      <button
                        onClick={() => setOrderType(OrderType.TAKEAWAY)}
                        className={cn(
                          "px-6 py-2 rounded-full font-bold transition-all text-[13px]",
                          orderType === OrderType.TAKEAWAY
                            ? "bg-brand-primary text-inverse-text shadow-sm"
                            : "text-text-muted hover:text-text-primary"
                        )}
                      >
                        MANG ĐI
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-md">
                    <div className="flex flex-col gap-sm">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">TÊN NGƯỜI NHẬN</Label>
                      <Input
                        placeholder="Tên người nhận"
                        value={deliveryInfo.receiverName}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            receiverName: e.target.value,
                          })
                        }
                        className="h-12 bg-surface-accent border-none"
                      />
                    </div>
                    <div className="flex flex-col gap-sm">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">SỐ ĐIỆN THOẠI</Label>
                      <Input
                        placeholder="Số điện thoại"
                        value={deliveryInfo.receiverPhone}
                        onChange={(e) =>
                          setDeliveryInfo({
                            ...deliveryInfo,
                            receiverPhone: e.target.value,
                          })
                        }
                        className="h-12 bg-surface-accent border-none"
                      />
                    </div>
                  </div>
                </div>
                
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
                    <div className="flex flex-col items-center justify-center py-3xl bg-surface-muted rounded-md border border-dashed border-text-muted/30">
                      <p className="text-h3-bold text-text-muted">Giỏ hàng của bạn đang trống</p>
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
                    isLoading={isPending}
                  />
                </div>
              </div>
            </div>
            <SuggestionSection className="mt-3xl" />
          </div>
        </main>
      ) : (
        <main className="min-h-screen bg-surface-accent pb-40 px-md pt-md flex flex-col gap-lg">
          <h1 className="text-h2-bold text-text-primary px-1">Giỏ hàng</h1>
          
          <AddressSelectionSection />

          <div className={cn(
            "p-xl rounded-md flex flex-col gap-lg bg-surface-muted"
          )}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-plus-jakarta text-body-lg-bold">
                Hình thức nhận
              </h3>
              <div className="flex bg-surface-accent p-1 rounded-full border border-black/5">
                <button
                  onClick={() => setOrderType(OrderType.DELIVERY)}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-bold transition-all text-[11px]",
                    orderType === OrderType.DELIVERY
                      ? "bg-brand-primary text-inverse-text shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  GIAO HÀNG
                </button>
                <button
                  onClick={() => setOrderType(OrderType.TAKEAWAY)}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-bold transition-all text-[11px]",
                    orderType === OrderType.TAKEAWAY
                      ? "bg-brand-primary text-inverse-text shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  MANG ĐI
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="flex flex-col gap-sm">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">NGƯỜI NHẬN</Label>
                <Input
                  placeholder="Tên..."
                  value={deliveryInfo.receiverName}
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      receiverName: e.target.value,
                    })
                  }
                  className="h-12 bg-surface-accent border-none"
                />
              </div>
              <div className="flex flex-col gap-sm">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">SĐT</Label>
                <Input
                  placeholder="SĐT..."
                  value={deliveryInfo.receiverPhone}
                  onChange={(e) =>
                    setDeliveryInfo({
                      ...deliveryInfo,
                      receiverPhone: e.target.value,
                    })
                  }
                  className="h-12 bg-surface-accent border-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-md">
            {items.map((item) => (
              <MobileCartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
            
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-surface-muted rounded-md border border-dashed border-text-muted/30">
                <p className="text-body-md-bold text-text-muted text-center px-4">
                  Chưa có món nào trong giỏ hàng<br />của bạn
                </p>
                <AppButton 
                  variant="outline" 
                  className="mt-4 rounded-full"
                  onClick={() => router.push('/menu')}
                >
                  XEM MENU NGAY
                </AppButton>
              </div>
            )}
          </div>

          <SuggestionSection className="mt-md" />

          {/* Sticky Mobile Summary */}
          {items.length > 0 && (
            <div className="fixed bottom-[67px] left-0 right-0 bg-surface-main p-md border-t border-border-primary-50 flex flex-col gap-md z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
              <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                  <span className="text-overline text-text-muted">TỔNG CỘNG</span>
                  <span className="text-h3-bold text-brand-primary">
                    {formatToVND(total)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-body-sm-reg text-text-muted">
                    {items.length} món
                  </span>
                </div>
              </div>
              <AppButton 
                variant="primary" 
                className="w-full h-14 rounded-full text-body-md-bold text-inverse-text shadow-lg active:scale-95 transition-all" 
                onClick={handleCheckout}
                isLoading={isPending}
              >
                THANH TOÁN NGAY
              </AppButton>
            </div>
          )}
        </main>
      )}
    </>
  );
}
