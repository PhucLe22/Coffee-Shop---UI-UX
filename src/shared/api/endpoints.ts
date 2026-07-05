export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PRODUCTS: {
    BASE: '/products',
    INTERNAL: '/internal/products',
    ADMIN: '/internal/admin/products',
    ADMIN_BY_ID: (id: string) => `/internal/admin/products/${id}`,
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID: (id: string) => `/products/id/${id}`,
    INTERNAL_BY_ID: (id: string) => `/internal/products/${id}`,
    TOGGLE_ACTIVE: (id: string) => `/internal/products/${id}/toggle-active`,
    OPTION_GROUPS: (productId: string, optionGroupId: string) => `/internal/products/${productId}/option-groups/${optionGroupId}`,
  },
  CATEGORIES: {
    BASE: '/categories',
  },
  ORDERS: {
    BASE: "/orders",
    ACTIVITIES: (id: string) => `/orders/${id}/activities`,
    INTERNAL: "/internal/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    BY_CODE: (code: string) => `/orders/code/${code}`,
    STATUS: (id: string) => `/internal/orders/${id}/status`,
    PICKUP: (id: string) => `/internal/orders/${id}/pickup`,
    COMPLETE: (id: string) => `/internal/orders/${id}/complete`,
    DELIVERY_COMPLETE: (id: string) => `/internal/orders/${id}/delivery/complete`,
    INTERNAL_BY_ID: (id: string) => `/internal/orders/${id}`,
  },
  CART: {
    BASE: '/cart',
  },
  STORES: {
    BASE: '/stores',
    INTERNAL: '/internal/admin/stores',
    INTERNAL_BY_ID: (id: string) => `/internal/admin/stores/${id}`,
  },
  AI: {
    CHAT: '/ai/chat',
  },
  DELIVERY: {
    SCHEDULE: '/internal/kitchen/delivery-schedule',
    SHIPPER_ROUTES: '/internal/admin/shipper-routes',
  },
  ADDRESSES: {
    BASE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },
  VOUCHERS: {
    INTERNAL: '/internal/vouchers',
    INTERNAL_BY_ID: (id: string) => `/internal/vouchers/${id}`,
  },
  OPTION_GROUPS: {
    BASE: '/internal/option-groups',
    BY_ID: (id: string) => `/internal/option-groups/${id}`,
  },
  PROMOTIONS: {
    BASE: '/promotions',
  },
  STAFF: {
    REGISTER: '/internal/auth/register/staff',
    BASE: '/internal/staff',
    BY_ID: (id: string) => `/internal/staff/${id}`,
    HARD_BY_ID: (id: string) => `/internal/staff/${id}/hard`,
  },
} as const;
