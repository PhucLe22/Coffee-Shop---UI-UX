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
    BY_SLUG: (slug: string) => `/products/${slug}`,
    BY_ID: (id: string) => `/products/id/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
  },
  ORDERS: {
    BASE: "/orders",
    INTERNAL: "/internal/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    BY_CODE: (code: string) => `/orders/code/${code}`,
    STATUS: (id: string) => `/internal/orders/${id}/status`,
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
} as const;
