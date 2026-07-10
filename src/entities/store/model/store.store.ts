import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Store } from '../model/types'

interface StoreState {
  selectedStore: Store | null
}

interface StoreActions {
  setSelectedStore: (store: Store | null) => void
}

type StoreStore = StoreState & StoreActions

export const useStoreStore = create<StoreStore>()(
  persist(
    (set) => ({
      selectedStore: null,
      setSelectedStore: (store) => set({ selectedStore: store }),
    }),
    {
      name: 'selected-store-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
