import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LoginOutput } from '@/shared/api'

interface AuthState {
  user: Omit<LoginOutput, 'accessToken' | 'refreshToken'> | null
  accessToken: string | null
  refreshToken: string | null
  _hasHydrated: boolean
}

interface AuthActions {
  setAuth: (authData: LoginOutput) => void
  logout: () => void
  setHasHydrated: (hydrated: boolean) => void
}

type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  _hasHydrated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (authData: LoginOutput) => {
        const { accessToken, refreshToken, ...user } = authData
        set({
          user,
          accessToken,
          refreshToken,
        })
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      },
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      // Optionally partialize what to persist
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
