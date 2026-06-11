import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { useCustomerAuthStore, useStaffAuthStore } from "../auth/auth.store";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Required to send/receive cookies (Refresh Token)
  headers: {
    "Content-Type": "application/json",
  },
});

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
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        
        // Update the correct store
        const isInternal = originalRequest.url?.startsWith('/internal') || originalRequest.url?.includes('/internal/');
        if (isInternal) {
          const { user, refreshToken, setAuth } = useStaffAuthStore.getState();
          if (user && refreshToken) {
             setAuth({ ...user, accessToken: newAccessToken, refreshToken } as any);
          }
        } else {
          const { user, refreshToken, setAuth } = useCustomerAuthStore.getState();
          if (user && refreshToken) {
             setAuth({ ...user, accessToken: newAccessToken, refreshToken } as any);
          }
        }

        // Update header and retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        const isInternal = originalRequest.url?.startsWith('/internal') || originalRequest.url?.includes('/internal/');
        if (isInternal) {
          useStaffAuthStore.getState().logout();
        } else {
          useCustomerAuthStore.getState().logout();
        }
        
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Exporting dummy setAccessToken for backward compatibility during migration
export const setAccessToken = (_token: string | null) => {};


export default axiosInstance;
