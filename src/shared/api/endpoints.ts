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
    BY_ID: (id: string) => `/orders/${id}`,
    BY_CODE: (code: string) => `/orders/code/${code}`,
  },
  CART: {
    BASE: '/cart',
  },
  STORES: {
    BASE: '/stores',
  },
} as const;
