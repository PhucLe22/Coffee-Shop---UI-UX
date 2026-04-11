export interface CartItem {
  id: string;
  name: string;
  options: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  origin?: string;
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
