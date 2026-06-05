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
      content: "Welcome back to the Roastery! I'm your digital concierge. How can I perfect your coffee ritual today?",
      timestamp: Date.now(),
    },
    {
      id: "2",
      role: "assistant",
      content: "I've found your recent order status:",
      timestamp: Date.now() + 100,
      attachment: {
        type: "order",
        data: {
          id: "#ORD-7294",
          status: "ĐANG GIAO",
          items: [
            { name: "Ethiopian Heirloom", price: "$24.00", quantity: "1x", image: FALLBACK_PRODUCT_IMAGE },
          ],
        },
      },
    },
    {
      id: "3",
      role: "user",
      content: "Can you show me my cart?",
      timestamp: Date.now() + 200,
    },
    {
      id: "4",
      role: "assistant",
      content: "Certainly! Here are the items currently in your cart:",
      timestamp: Date.now() + 300,
      attachment: {
        type: "cart",
        data: {
          total: "$33.00",
          items: [
            { name: "Cold Brew Nitro", price: "$5.50", image: FALLBACK_PRODUCT_IMAGE },
            { name: "Caramel Macchiato", price: "$5.50", image: FALLBACK_PRODUCT_IMAGE },
            { name: "Ethiopian Heirloom", price: "$22.00", image: FALLBACK_PRODUCT_IMAGE },
          ],
        },
      },
    },
    {
      id: "5",
      role: "assistant",
      content: "Wait, I have a special recommendation for you today!",
      timestamp: Date.now() + 400,
      attachment: {
        type: "product",
        data: {
          name: "Caramel Macchiato",
          price: "$5.50",
          slug: "caramel-macchiato",
          description: "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.",
          image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=1974&auto=format&fit=crop"
        }
      }
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
