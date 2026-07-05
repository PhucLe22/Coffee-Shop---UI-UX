"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useIsMobile, formatToVND } from "@/shared/lib";
import { cn } from "@/shared/lib/utils";
import {
  useInternalCartStore,
  InternalCartItem,
  useCreateStaffOrder,
} from "@/entities/order";
import { useSearchCustomers, CreateCustomerModal } from "@/entities/customer";
import {
  DesktopProductCard,
  ProductCardDetailed,
  useProducts,
} from "@/entities/product";
import { InternalOrderOptionModal } from "@/widgets/internal-order-create/ui/internal-order-option-modal";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { toast } from "sonner";
import { OrderType } from "@/shared/api";
import { VoucherService, ValidateVoucherResponse } from "@/entities/voucher";

// Temporary mock data for categories
const CATEGORIES = ["TẤT CẢ", "CÀ PHÊ", "TRÀ", "BÁNH", "KHÔNG CÀ PHÊ"];

interface CartContentItemsProps {
  items: InternalCartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContentItems = ({ items, updateQuantity }: CartContentItemsProps) => (
  <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-md">
    {items.length === 0 ? (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-md opacity-50">
        <ShoppingBag className="size-16 stroke-[1]" />
        <p className="text-body-md-semibold">Giỏ hàng trống</p>
      </div>
    ) : (
      items.map((item) => (
        <div
          key={item.id}
          className="flex gap-md bg-white/50 p-md rounded-lg border border-border-primary-50/5 shadow-sm">
          <div className="size-20 rounded-md bg-surface-muted overflow-hidden shrink-0">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-body-md-bold text-text-primary line-clamp-1">
                {item.name}
              </h4>
              <p className="text-[11px] text-text-muted">
                {item.options?.size}
                {item.options?.milk !== "None" ? `, ${item.options?.milk}` : ""}
                {item.options?.toppings && item.options.toppings.length > 0
                  ? `, ${item.options.toppings.join(", ")}`
                  : ""}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-md-bold text-brand-primary">
                {formatToVND(item.price)}
              </span>
              <div className="flex items-center gap-sm bg-surface-muted rounded-full px-2 py-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="size-6 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                  <Minus className="size-3" />
                </button>
                <span className="text-xs font-bold w-4 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="size-6 flex items-center justify-center rounded-full hover:bg-white transition-colors">
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
  voucherInput: string;
  onVoucherInputChange: (value: string) => void;
  appliedVoucher: ValidateVoucherResponse | null;
  isValidating: boolean;
  voucherError: string;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
}

const OrderSummaryFooter = ({
  getSubtotal,
  getDiscount,
  getTotal,
  onPlaceOrder,
  isPending,
  voucherInput,
  onVoucherInputChange,
  appliedVoucher,
  isValidating,
  voucherError,
  onApplyVoucher,
  onRemoveVoucher,
}: OrderSummaryFooterProps) => (
  <div className="p-lg flex flex-col gap-md bg-surface-accent border-t border-border-primary-50/10">
    <div className="flex flex-col gap-sm">
      <div className="flex justify-between text-body-sm-reg text-text-primary">
        <span>Tạm Tính</span>
        <span>{formatToVND(getSubtotal())}</span>
      </div>
      <div className="flex justify-between text-body-sm-reg text-text-secondary">
        <span>Giảm Giá</span>
        <span>-{formatToVND(getDiscount())}</span>
      </div>
      <Separator className="my-sm opacity-10" />
      <div className="flex justify-between items-end">
        <span className="text-h3-bold text-text-secondary">Tổng Cộng</span>
        <span className="text-h2-bold text-text-primary">
          {formatToVND(getTotal())}
        </span>
      </div>
    </div>

    <div className="flex flex-col gap-sm mt-md">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
          Mã Giảm Giá
        </label>
        {appliedVoucher ? (
          <div className="flex items-center justify-between bg-success/20 border border-success/20 rounded-[8px] px-md py-sm">
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-success">{appliedVoucher.code}</span>
              <span className="text-[12px] text-success">
                Giảm {formatToVND(appliedVoucher.discountAmount)}
                {appliedVoucher.discountType === 'PERCENT' && ` (${appliedVoucher.discountValue}%)`}
              </span>
            </div>
            <button
              onClick={onRemoveVoucher}
              className="text-[12px] font-bold text-red-500 hover:underline"
            >
              HỦY
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            <Input
              placeholder="Nhập mã"
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value)}
              className="h-[49px] rounded-[8px] bg-surface-accent border-none"
              onKeyDown={(e) => e.key === 'Enter' && onApplyVoucher()}
            />
            <Button
              variant="outline"
              className="w-full h-[49px] rounded-[8px] font-bold text-xs"
              onClick={onApplyVoucher}
              disabled={isValidating}
            >
              {isValidating ? "..." : "ÁP DỤNG"}
            </Button>
          </div>
        )}
        {voucherError && (
          <span className="text-[11px] text-error font-medium">{voucherError}</span>
        )}
      </div>
      <Button 
        onClick={onPlaceOrder}
        disabled={isPending}
        className="w-full h-14 bg-brand-primary text-white font-extrabold text-[13px] tracking-widest shadow-lg shadow-brand-primary/20 rounded-full mt-md"
      >
        {isPending ? "ĐANG TẠO ĐƠN..." : "TẠO ĐƠN HÀNG"}
      </Button>
    </div>
  </div>
);

export default function InternalOrderCreatePage() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(
    null,
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string;
    name: string;
    phone: string;
  } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.TAKEAWAY);
  const [tableNumber, setTableNumber] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<ValidateVoucherResponse | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  const { data: productsData, isLoading } = useProducts({});
  const products = productsData?.data || [];

  const { data: searchResults } = useSearchCustomers(
    customerSearch,
    customerSearch.length > 3,
  );

  const { items, updateQuantity, clearCart } =
    useInternalCartStore();

  const subtotalValue = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0,
  );
  const discountValue = appliedVoucher?.discountAmount ?? 0;
  const totalValue = subtotalValue - discountValue;

  const { mutate: createStaffOrder, isPending: isCreatingOrder } =
    useCreateStaffOrder();

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim();
    if (!code) {
      setVoucherError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsValidatingVoucher(true);
    setVoucherError("");

    try {
      const res = await VoucherService.validateVoucher({
        code,
        orderAmount: subtotalValue,
      });
      setAppliedVoucher(res.data);
      setVoucherError("");
      toast.success(`Áp dụng mã ${code} thành công!`);
    } catch (err: any) {
      setAppliedVoucher(null);
      setVoucherError(err.response?.data?.message || "Mã giảm giá không hợp lệ");
      toast.error(err.response?.data?.message || "Mã giảm giá không hợp lệ");
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherError("");
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Giỏ hàng trống");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }

    if (orderType === OrderType.DINE_IN && !tableNumber) {
      toast.error("Vui lòng nhập số bàn");
      return;
    }

    const defaultNote = orderType === OrderType.DINE_IN 
      ? `Customer is sitting at table ${tableNumber}` 
      : "Staff creating order for customer";

    const orderData: any = {
      type: orderType,
      tableNumber: orderType === OrderType.DINE_IN ? tableNumber : undefined,
      phone: selectedCustomer.phone,
      note: orderNote.trim() || defaultNote,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        options: item.selectedOptionIds?.map((id) => ({ optionId: id })) || [],
      })),
    };

    if (appliedVoucher) {
      orderData.voucherCode = appliedVoucher.code;
    }

    console.log("Order Payload:", orderData);

    createStaffOrder(orderData, {
      onSuccess: (response) => {
        toast.success("Tạo đơn hàng thành công!");
        clearCart();
        setSelectedCustomer(null);
        setCustomerSearch("");
        setAppliedVoucher(null);
        setVoucherInput("");
        setVoucherError("");
        setOrderNote("");
        setTableNumber("");
        setOrderType(OrderType.TAKEAWAY);
        queryClient.invalidateQueries({ queryKey: ["internal-orders"] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Tạo đơn hàng thất bại");
      },
    });
  };

  const handleCustomerCreated = (c: { id: string; name: string; phone: string }) => {
    setSelectedCustomer({ id: c.id, name: c.name, phone: c.phone });
    setCustomerSearch(c.name);
    setShowCreateModal(false);
  };

  const filteredProducts = products.filter(
    (p: any) =>
      (activeCategory === "ALL" ||
        p.category.name.toUpperCase() === activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-surface-main relative">
        <div className="flex-1 flex flex-col min-w-0 bg-surface-main">
          <div className="flex-1 overflow-y-auto no-scrollbar p-md md:p-xl flex flex-col gap-lg">
            <div className="flex flex-col gap-md p-md bg-surface-accent/50 rounded-md border border-border-primary-50/10 shadow-sm">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Cấu Hình Đơn Hàng</span>
              
              <div className="flex flex-col gap-sm">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Loại Đơn</span>
                <div className="flex gap-md">
                  <Button
                    variant={orderType === OrderType.DINE_IN ? "default" : "outline"}
                    onClick={() => setOrderType(OrderType.DINE_IN)}
                    className={cn(
                      "flex-1 h-10 rounded-md font-bold text-xs transition-all",
                      orderType === OrderType.DINE_IN ? "bg-brand-primary text-white" : "border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                    )}
                  >
                    TẠI QUÁN
                  </Button>
                  <Button
                    variant={orderType === OrderType.TAKEAWAY ? "default" : "outline"}
                    onClick={() => setOrderType(OrderType.TAKEAWAY)}
                    className={cn(
                      "flex-1 h-10 rounded-md font-bold text-xs transition-all",
                      orderType === OrderType.TAKEAWAY ? "bg-brand-primary text-white" : "border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                    )}
                  >
                    MANG ĐI
                  </Button>
                </div>
              </div>

              {orderType === OrderType.DINE_IN && (
                <div className="flex flex-col gap-sm animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Số Bàn</span>
                  <Input 
                    placeholder="Nhập số bàn..." 
                    className="h-10 bg-white border-none rounded-md text-sm shadow-none focus-visible:ring-1 focus-visible:ring-brand-primary/20"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-sm">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Chọn Khách Hàng</span>
                <div className="flex gap-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                    <Input
                      placeholder="Tìm kiếm theo số điện thoại..."
                      className="pl-9 h-10 bg-white border-none rounded-md text-sm shadow-none focus-visible:ring-1 focus-visible:ring-brand-primary/20"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {searchResults?.data &&
                      searchResults.data.length > 0 &&
                      !selectedCustomer && (
                        <div className="absolute top-full left-0 w-full bg-white border rounded-md shadow-md z-20 mt-1">
                          {searchResults.data.map((c) => (
                            <div
                              key={c.id}
                              className="p-sm cursor-pointer hover:bg-surface-muted"
                              onClick={() => {
                                setSelectedCustomer({ id: c.id, name: c.name, phone: c.phone });
                                setCustomerSearch(c.name);
                              }}>
                              {c.name} - {c.phone}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <Button
                    variant="outline"
                    className="h-10 px-md text-xs font-bold rounded-md border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5"
                    onClick={() => setShowCreateModal(true)}>
                    KHÁCH MỚI
                  </Button>
                </div>
                {selectedCustomer && (
                  <div className="text-sm font-bold text-brand-primary">
                    Selected: {selectedCustomer.name}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-sm">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Ghi Chú Đơn Hàng</span>
                <Textarea 
                  placeholder="Nhập ghi chú cho đơn hàng..." 
                  className="bg-white border-none rounded-md text-sm shadow-none focus-visible:ring-1 focus-visible:ring-brand-primary/20 min-h-[80px]"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  maxLength={255}
                />
                <div className="flex justify-end">
                  <span className={cn(
                    "text-[10px] font-medium",
                    orderNote.length >= 255 ? "text-error" : "text-text-muted"
                  )}>
                    {orderNote.length}/255
                  </span>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-md">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Chọn Sản Phẩm
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-text-muted" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
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
                        : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80",
                    )}>
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md md:gap-lg">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-[230/380] w-full rounded-lg"
                    />
                  ))
                : filteredProducts.map((product: any) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductSlug(product.slug)}
                      className="cursor-pointer group">
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
                  ))}
            </div>
          </div>
        </div>

        {/* Sidebar Summary (Desktop) */}
        {!isMobile && (
          <aside className="w-[400px] xl:w-[450px] bg-surface-accent border-l border-border-primary-50/10 flex flex-col sticky top-0 h-screen shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
            <div className="p-lg flex items-center justify-between border-b border-border-primary-50/10 bg-surface-accent/50 backdrop-blur-md">
              <h2 className="text-h4-bold text-text-primary">Tóm Tắt Đơn Hàng</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-muted hover:text-error hover:bg-error/10"
                onClick={clearCart}>
                <Trash2 className="size-5" />
              </Button>
            </div>

            <CartContentItems items={items} updateQuantity={updateQuantity} />
            <OrderSummaryFooter
              getSubtotal={() => subtotalValue}
              getDiscount={() => discountValue}
              getTotal={() => totalValue}
              onPlaceOrder={handlePlaceOrder}
              isPending={isCreatingOrder}
              voucherInput={voucherInput}
              onVoucherInputChange={setVoucherInput}
              appliedVoucher={appliedVoucher}
              isValidating={isValidatingVoucher}
              voucherError={voucherError}
              onApplyVoucher={handleApplyVoucher}
              onRemoveVoucher={handleRemoveVoucher}
            />
          </aside>
        )}

        {/* Mobile Sticky Footer & Cart Sheet */}
        {isMobile && items.length > 0 && (
          <>
            <div className="fixed bottom-[87px] left-0 right-0 p-md bg-surface-accent border-t border-border-primary-50/10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] flex items-center justify-between z-[50] animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  Tổng Tiền
                </span>
                <span className="text-h3-bold text-text-primary">
                  {formatToVND(totalValue)}
                </span>
              </div>
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button className="rounded-full px-xl h-12 bg-brand-primary text-white font-bold tracking-widest text-[12px] shadow-lg shadow-brand-primary/20">
                    XEM GIỎ ({items.length})
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="h-[80vh] rounded-t-[32px] p-0 flex flex-col bg-surface-main border-none shadow-2xl">
                  <SheetHeader className="p-lg border-b border-border-primary-50/5">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-h3-bold text-text-primary">
                        Tóm Tắt Đơn Hàng
                      </SheetTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-muted hover:text-error"
                        onClick={clearCart}>
                        <Trash2 className="size-5" />
                      </Button>
                    </div>
                  </SheetHeader>
                  <CartContentItems
                    items={items}
                    updateQuantity={updateQuantity}
                  />
                  <OrderSummaryFooter
                    getSubtotal={() => subtotalValue}
                    getDiscount={() => discountValue}
                    getTotal={() => totalValue}
                    onPlaceOrder={handlePlaceOrder}
                    isPending={isCreatingOrder}
                    voucherInput={voucherInput}
                    onVoucherInputChange={setVoucherInput}
                    appliedVoucher={appliedVoucher}
                    isValidating={isValidatingVoucher}
                    voucherError={voucherError}
                    onApplyVoucher={handleApplyVoucher}
                    onRemoveVoucher={handleRemoveVoucher}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>

      {/* Option Selection Modal */}
      {selectedProductSlug && (
        <InternalOrderOptionModal
          key={selectedProductSlug}
          productSlug={selectedProductSlug}
          onClose={() => setSelectedProductSlug(null)}
        />
      )}

      {/* Create Customer Modal */}
      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCustomerCreated}
        />
      )}
    </>
  );
}
