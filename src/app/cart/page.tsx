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
import { Minus, Plus } from "lucide-react";
import { AppButton, Input, Label } from "@/shared/ui";
import { useCreateOrder } from "@/entities/order";
import { OrderType } from "@/shared/api";
import { useStores } from "@/entities/store";
import { toast } from "sonner";
import Link from "next/link";

export default function CartPage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { user } = useCustomerAuthStore();
  const { data: storesResponse } = useStores();
  const { selectedStore, setSelectedStore } = useStoreStore();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const stores = storesResponse?.data || [];

  const [orderType, setOrderType] = useState<OrderType>(OrderType.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    receiverName: "",
    receiverPhone: "",
    addressLine: "",
  });

  // Prefill user info
  useEffect(() => {
    if (user) {
      setDeliveryInfo((prev) => ({
        ...prev,
        receiverName: prev.receiverName || user.name || "",
        receiverPhone: prev.receiverPhone || user.phone || "",
      }));
    }
  }, [user]);

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
      router.push("/locations");
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
        // Redirect to order detail page using the order code
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

  const MOCK_SAVED_INFO = [
    {
      id: "1",
      label: "Nhà riêng",
      receiverName: "Gia Bảo",
      receiverPhone: "0917630445",
      addressLine: "123 Đường Espresso, Quận 1, TP. HCM",
    },
    {
      id: "2",
      label: "Công ty",
      receiverName: "Gia Bảo",
      receiverPhone: "0917630445",
      addressLine: "456 Đường Arabica, Quận 7, TP. HCM",
    },
  ];

  const handleSelectSavedInfo = (infoId: string) => {
    const selected = MOCK_SAVED_INFO.find((info) => info.id === infoId);
    if (selected) {
      setDeliveryInfo({
        receiverName: selected.receiverName,
        receiverPhone: selected.receiverPhone,
        addressLine: selected.addressLine,
      });
    }
  };

  const StoreSelectionSection = () => (
    <div className={cn(
      "p-xl rounded-md flex flex-col gap-md",
      !isMobile ? "bg-[#ebe0d9]" : "bg-surface-muted"
    )}>
      <div className="flex items-center justify-between">
        <h3 className={cn(
          "font-bold font-plus-jakarta",
          !isMobile ? "text-[20px]" : "text-body-lg-bold"
        )}>
          Cửa hàng phục vụ
        </h3>
        <Link href="/locations" className="text-body-sm-bold text-brand-primary hover:underline">
          Xem bản đồ
        </Link>
      </div>
      <select 
        className="h-12 w-full rounded-md bg-[#faf2eb] px-md py-sm text-body-md-reg text-text-primary focus:outline-none border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        value={selectedStore?.id || ""}
        onChange={(e) => {
          const store = stores.find(s => s.id === e.target.value);
          if (store) setSelectedStore(store);
        }}
      >
        <option value="" disabled>Chọn cửa hàng...</option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>{store.name} - {store.address}</option>
        ))}
      </select>
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
        <main className="min-h-screen bg-[#faf2eb] pb-3xl">
          <div className="container mx-auto px-2xl py-xl">
            <div className="grid grid-cols-12 gap-xl">
              <div className="col-span-8 flex flex-col gap-lg">
                <StoreSelectionSection />

                <div className={cn(
                  "p-xl rounded-md flex flex-col gap-lg bg-[#ebe0d9]"
                )}>
                  <h3 className="font-bold font-plus-jakarta text-[20px]">
                    Phương thức nhận hàng
                  </h3>
                  <div className="flex gap-md">
                    <button
                      onClick={() => setOrderType(OrderType.TAKEAWAY)}
                      className={cn(
                        "flex-1 py-md rounded-lg font-bold transition-all",
                        orderType === OrderType.TAKEAWAY
                          ? "bg-brand-primary text-inverse-text shadow-md"
                          : "bg-[#faf2eb] text-text-muted hover:text-text-primary"
                      )}
                    >
                      MANG ĐI
                    </button>
                    <button
                      onClick={() => setOrderType(OrderType.DELIVERY)}
                      className={cn(
                        "flex-1 py-md rounded-lg font-bold transition-all",
                        orderType === OrderType.DELIVERY
                          ? "bg-brand-primary text-inverse-text shadow-md"
                          : "bg-[#faf2eb] text-text-muted hover:text-text-primary"
                      )}
                    >
                      GIAO HÀNG
                    </button>
                  </div>

                  {orderType === OrderType.DELIVERY && (
                    <div className="flex flex-col gap-md">
                      <div className="flex flex-col gap-sm">
                        <Label>Sử dụng thông tin đã lưu</Label>
                        <select 
                          className="h-12 w-full rounded-md bg-[#faf2eb] px-md py-sm text-body-md-reg text-text-primary focus:outline-none border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                          onChange={(e) => handleSelectSavedInfo(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Chọn thông tin giao hàng...</option>
                          {MOCK_SAVED_INFO.map(info => (
                            <option key={info.id} value={info.id}>{info.label} - {info.addressLine}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-md">
                        <div className="flex flex-col gap-sm">
                          <Label>Người nhận</Label>
                          <Input
                            placeholder="Tên người nhận"
                            value={deliveryInfo.receiverName}
                            onChange={(e) =>
                              setDeliveryInfo({
                                ...deliveryInfo,
                                receiverName: e.target.value,
                              })
                            }
                            className="bg-[#faf2eb]"
                          />
                        </div>
                        <div className="flex flex-col gap-sm">
                          <Label>Số điện thoại</Label>
                          <Input
                            placeholder="Số điện thoại"
                            value={deliveryInfo.receiverPhone}
                            onChange={(e) =>
                              setDeliveryInfo({
                                ...deliveryInfo,
                                receiverPhone: e.target.value,
                              })
                            }
                            className="bg-[#faf2eb]"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-sm">
                        <Label>Địa chỉ giao hàng</Label>
                        <Input
                          placeholder="Số nhà, tên đường, quận/huyện..."
                          value={deliveryInfo.addressLine}
                          onChange={(e) =>
                            setDeliveryInfo({
                              ...deliveryInfo,
                              addressLine: e.target.value,
                            })
                          }
                          className="bg-[#faf2eb]"
                        />
                      </div>
                    </div>
                  )}
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
                    <div className="flex flex-col items-center justify-center py-3xl bg-[#ebe0d9] rounded-md border border-dashed border-text-muted/30">
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
          
          <StoreSelectionSection />

          <div className={cn(
            "p-xl rounded-md flex flex-col gap-lg bg-surface-muted"
          )}>
            <h3 className="font-bold font-plus-jakarta text-body-lg-bold">
              Phương thức nhận hàng
            </h3>
            <div className="flex gap-md">
              <button
                onClick={() => setOrderType(OrderType.TAKEAWAY)}
                className={cn(
                  "flex-1 py-md rounded-lg font-bold transition-all",
                  orderType === OrderType.TAKEAWAY
                    ? "bg-brand-primary text-inverse-text shadow-md"
                    : "bg-[#faf2eb] text-text-muted hover:text-text-primary"
                )}
              >
                MANG ĐI
              </button>
              <button
                onClick={() => setOrderType(OrderType.DELIVERY)}
                className={cn(
                  "flex-1 py-md rounded-lg font-bold transition-all",
                  orderType === OrderType.DELIVERY
                    ? "bg-brand-primary text-inverse-text shadow-md"
                    : "bg-[#faf2eb] text-text-muted hover:text-text-primary"
                )}
              >
                GIAO HÀNG
              </button>
            </div>

            {orderType === OrderType.DELIVERY && (
              <div className="flex flex-col gap-md">
                <div className="flex flex-col gap-sm">
                  <Label>Sử dụng thông tin đã lưu</Label>
                  <select 
                    className="h-12 w-full rounded-md bg-[#faf2eb] px-md py-sm text-body-md-reg text-text-primary focus:outline-none border-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    onChange={(e) => handleSelectSavedInfo(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Chọn thông tin giao hàng...</option>
                    {MOCK_SAVED_INFO.map(info => (
                      <option key={info.id} value={info.id}>{info.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="flex flex-col gap-sm">
                    <Label>Người nhận</Label>
                    <Input
                      placeholder="Tên người nhận"
                      value={deliveryInfo.receiverName}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          receiverName: e.target.value,
                        })
                      }
                      className="bg-[#faf2eb]"
                    />
                  </div>
                  <div className="flex flex-col gap-sm">
                    <Label>Số điện thoại</Label>
                    <Input
                      placeholder="Số điện thoại"
                      value={deliveryInfo.receiverPhone}
                      onChange={(e) =>
                        setDeliveryInfo({
                          ...deliveryInfo,
                          receiverPhone: e.target.value,
                        })
                      }
                      className="bg-[#faf2eb]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-sm">
                  <Label>Địa chỉ giao hàng</Label>
                  <Input
                    placeholder="Số nhà, tên đường, quận/huyện..."
                    value={deliveryInfo.addressLine}
                    onChange={(e) =>
                      setDeliveryInfo({
                        ...deliveryInfo,
                        addressLine: e.target.value,
                      })
                    }
                    className="bg-[#faf2eb]"
                  />
                </div>
              </div>
            )}
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
              <div className="flex flex-col items-center justify-center py-20 bg-surface-muted rounded-2xl border border-dashed border-text-muted/30">
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
