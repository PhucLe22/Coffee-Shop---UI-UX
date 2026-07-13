import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { LoginOutput } from '../api/contracts'

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

export type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  _hasHydrated: false,
}

const createAuthStore = (storageName: string) => 
  create<AuthStore>()(
    persist(
      (set) => ({
        ...initialState,
        setAuth: (authData: LoginOutput) => {
          const { accessToken, refreshToken, ...user } = authData
          
          // Decode JWT to get extra claims like lat, lng
          let lat: number | undefined = user.lat
          let lng: number | undefined = user.lng
          
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]))
            if (payload.lat) lat = payload.lat
            if (payload.lng) lng = payload.lng
          } catch (e) {
            console.error('Failed to decode JWT', e)
          }

          set({
            user: { ...user, lat, lng },
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
          if (typeof window !== 'undefined') {
            localStorage.removeItem(storageName)
          }
        },
        setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
      }),
      {
        name: storageName,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true)
        },
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    )
  )

export const useCustomerAuthStore = createAuthStore('customer-auth-storage')
export const useStaffAuthStore = createAuthStore('staff-auth-storage')

// For backward compatibility during migration
export const useAuthStore = useCustomerAuthStore
