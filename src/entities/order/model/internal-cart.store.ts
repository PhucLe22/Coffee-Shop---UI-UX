import { create } from 'zustand'

export interface InternalCartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  selectedOptionIds?: string[]
  options?: {
    size?: string
    sweetness?: string
    milk?: string
    toppings?: string[]
  }
}

interface InternalCartStore {
  items: InternalCartItem[]
  addItem: (item: InternalCartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const useInternalCartStore = create<InternalCartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => 
          i.productId === item.productId && 
          JSON.stringify(i.options) === JSON.stringify(item.options)
      )

      if (existingItemIndex !== -1) {
        const newItems = [...state.items]
        newItems[existingItemIndex].quantity += item.quantity
        return { items: newItems }
      }

      return { items: [...state.items, item] }
    })
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }))
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    }))
  },
  clearCart: () => {
    set({ items: [] })
  },
  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0), 0)
  },
  getDiscount: () => {
    return 0 // TODO: Implement discount logic
  },
  getTotal: () => {
    return get().getSubtotal() - get().getDiscount()
  },
}))
