import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { API_ENDPOINTS } from "./endpoints";
import { useCustomerAuthStore, useStaffAuthStore } from "../auth/auth.store";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required to send/receive cookies (Refresh Token)
  headers: {
    "Content-Type": "application/json",
  },
});

// Demo mode: answer every request from the in-browser seed dataset (no backend needed).
if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
  const lazyMockAdapter = async (config: InternalAxiosRequestConfig) =>
    (await import("./mock/adapter")).mockAdapter(config);
  axiosInstance.defaults.adapter = lazyMockAdapter;
  axios.defaults.adapter = lazyMockAdapter; // token refresh uses the bare axios instance
}

// Request interceptor: Attach Access Token as Bearer
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Determine which token to use based on the URL
    const isInternal = config.url?.startsWith('/internal') || config.url?.includes('/internal/');
    const token = isInternal 
      ? useStaffAuthStore.getState().accessToken 
      : useCustomerAuthStore.getState().accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor: Handle 401 and Refresh Token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {},
        { withCredentials: true }
      );

      const data = response.data?.data || response.data;
      
      let newAccessToken: string;
      let newRefreshToken: string;

      if (data.tokens) {
        newAccessToken = data.tokens.accessToken;
        newRefreshToken = data.tokens.refreshToken;
      } else {
        newAccessToken = data.accessToken;
        newRefreshToken = data.refreshToken;
      }

      const isInternal = originalRequest.url?.startsWith('/internal') || originalRequest.url?.includes('/internal/');
      if (isInternal) {
        const { user, setAuth } = useStaffAuthStore.getState();
        if (user) {
          setAuth({ ...user, accessToken: newAccessToken, refreshToken: newRefreshToken } as any);
        }
      } else {
        const { user, setAuth } = useCustomerAuthStore.getState();
        if (user) {
          setAuth({ ...user, accessToken: newAccessToken, refreshToken: newRefreshToken } as any);
        }
      }

      processQueue(null, newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      const isInternal = originalRequest.url?.startsWith('/internal') || originalRequest.url?.includes('/internal/');
      if (isInternal) {
        useStaffAuthStore.getState().logout();
      } else {
        useCustomerAuthStore.getState().logout();
      }
      
      if (typeof window !== "undefined") {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Exporting dummy setAccessToken for backward compatibility during migration
export const setAccessToken = (_token: string | null) => {};


export default axiosInstance;
