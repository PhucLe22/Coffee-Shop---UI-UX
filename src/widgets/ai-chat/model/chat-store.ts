import { create } from "zustand";

export interface OrderItem {
  name: string;
  price: string;
  quantity: string;
  image?: string;
}

export interface CartItem {
  name: string;
  price: string;
  image?: string;
}

export interface ProductAttachment {
  name: string;
  price: string;
  description: string;
  slug: string;
  image?: string;
}

export interface PromotionVoucher {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  maxUsage?: number;
  usedCount?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: number;
  attachment?: {
    type: "order";
    data: {
      id: string;
      status: string;
      items: OrderItem[];
    };
  } | {
    type: "cart";
    data: {
      total: string;
      items: CartItem[];
    };
  } | {
    type: "product";
    data: ProductAttachment;
  } | {
    type: "promotion";
    data: {
      vouchers: PromotionVoucher[];
    };
  } | {
    type: "stores";
    data: Array<{
      storeName: string;
      address: string;
    }>;
  } | {
    type: "closestStore";
    data: {
      storeName: string;
      address: string;
      distance: string;
      lat: number;
      lng: number;
    };
  };
}

interface ChatState {
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearChat: () => void;
}

export const FALLBACK_PRODUCT_IMAGE = "https://images.pexels.com/photos/10121701/pexels-photo-10121701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "1",
      role: "assistant",
      content: "Chào bạn! Tôi là trợ lý AI của Amber Roast. Tôi có thể giúp gì cho bạn hôm nay?",
      timestamp: Date.now(),
    },
  ],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
        },
      ],
    })),
  clearChat: () => set({ messages: [] }),
}));
