import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { authBridge } from "./authBridge";

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";
// const API_URL = process.env.EXPO_BASE_URL ?? BASE_URL;

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  withCredentials: false,
});

// Refresh queue handling
let isRefreshing = false;
let queue: ((token:string) => void)[]=[];

function subscribe(cb: (token: string) => void) {
  queue.push(cb);
}

function publish(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// Request Interceptor: add token automatically
api.interceptors.request.use((config) => {
  const token = authBridge.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
    console.log("Attaching Bearer", token.slice(0,12));
  }
  return config;
});

// Request interceptor: Handle  / refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Handdle  errors once per request
    if (status !== 401 || original._retry) throw error;

    // Avoid refreshing if the refresh call itself failed
    if (original.url?.includes("/auth/refresh")) {
      await authBridge.callLogout();
      throw error;
    }

    original._retry = true;

    const doRefresh = async () => {
      const refreshToken = await authBridge.getRefreshToken();
      if (!refreshToken) {
        await authBridge.callLogout();
        throw error;
      }

      try {
        const r = await axios.post(`${DEFAULT_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        const newToken = (r.data as any).access_token;
        authBridge.setAccessToken(newToken);
        return newToken;
      } catch (error) {
        await authBridge.callLogout();
        throw error;
      }
    };

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await doRefresh();
        isRefreshing = false;
        publish(newToken);
        console.log("[services/api] doRefresh", "refreshing!!");
      }

      // Wait for refresh if already in progress
      const newToken = await new Promise<string>((resolve) =>
        subscribe(resolve)
      );

      // Retry the original request with the new token
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newToken}`;
      console.log("Refreshed")
      return api(original);
    } catch (error) {
      isRefreshing = false;
      queue = [];
      await authBridge.callLogout();
      throw error;
    }
  }
);
// export async function api<T>(path:string, init?:RequestInit): Promise<T> {
//     console.log(`${DEFAULT_BASE_URL}${path}`)
//     const res = await fetch(`${DEFAULT_BASE_URL}${path}`, {
//         headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {})},
//         ...init,
//     });
//     if (!res.ok) throw new Error(await res.text());
//     return res.json()
// }
