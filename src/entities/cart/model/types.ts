export interface CartItemOption {
  optionId: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item id (productId + hash of options)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  origin?: string;
  note?: string;
  options: CartItemOption[];
}

export interface CartState {
  items: CartItem[];
  _hasHydrated: boolean;
}

export interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export type CartStore = CartState & CartActions;
