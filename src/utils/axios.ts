import axios from 'axios';
import { store } from '@/app/store';
import { refreshAccessToken, clearAuth } from '@/features/auth/authSlice';


// Create axios instance
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: any) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

const SAFETY_WINDOW_SECONDS = 60;

async function getValidAccessToken(): Promise<string> {
  const state = store.getState();
  const token = state.auth.token || localStorage.getItem('accessToken');
  const expiresAt =
    state.auth.expiresAt ||
    (localStorage.getItem('accessTokenExp')
      ? Number(localStorage.getItem('accessTokenExp'))
      : null);

  if (!token) {
    throw new Error('No access token');
  }

  const now = Math.floor(Date.now() / 1000);

  const shouldRefresh = !expiresAt || now >= expiresAt - SAFETY_WINDOW_SECONDS;

  if (!shouldRefresh) return token;

  if (isRefreshing) {
    return await new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const result = await store.dispatch(refreshAccessToken());

    if (refreshAccessToken.fulfilled.match(result)) {
      const newToken = result.payload.token;
      processQueue(null, newToken);
      return newToken;
    }

    const err = new Error('Refresh rejected');
    processQueue(err);
    store.dispatch(clearAuth());
    throw err;
  } catch (e) {
    processQueue(e);
    store.dispatch(clearAuth());
    throw e;
  } finally {
    isRefreshing = false;
  }
}

// ---- Request interceptor: refresh BEFORE request if needed ----
axiosInstance.interceptors.request.use(
  async (config) => {
    if ((config as any).skipAuth) {
      return config;
    }

    try {
      const token = await getValidAccessToken();
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (e) {
      return Promise.reject(e);
    }
  },
  (error) => Promise.reject(error)
);


// ---- Response interceptor: fallback  ----
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const token = await getValidAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
