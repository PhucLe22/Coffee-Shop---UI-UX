export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    INTERNAL: '/internal/products',
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID: (id: string) => `/products/id/${id}`,
    INTERNAL_BY_ID: (id: string) => `/internal/products/${id}`,
    OPTION_GROUPS: (productId: string, optionGroupId: string) => `/internal/products/${productId}/option-groups/${optionGroupId}`,
  },
  CATEGORIES: {
    BASE: '/categories',
  },
  ORDERS: {
    BASE: "/orders",
    INTERNAL: "/internal/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    BY_CODE: (code: string) => `/orders/code/${code}`,
    STATUS: (id: string) => `/internal/staff/orders/${id}/status`,
  },
  CART: {
    BASE: '/cart',
  },
  STORES: {
    BASE: '/stores',
  },
  AI: {
    CHAT: '/ai/chat',
  },
  DELIVERY: {
    SCHEDULE: '/internal/kitchen/delivery-schedule',
  },
  ADDRESSES: {
    BASE: '/addresses',
    BY_ID: (id: string) => `/addresses/${id}`,
  },
  VOUCHERS: {
    INTERNAL: '/internal/vouchers',
    INTERNAL_BY_ID: (id: string) => `/internal/vouchers/${id}`,
  },
  PROMOTIONS: {
    BASE: '/promotions',
  },
} as const;
