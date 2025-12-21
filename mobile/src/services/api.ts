import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
import { authBridge } from "./authBridge";
import { useAuth } from "../store/auth";

function getTokens() {
  const s = useAuth.getState();
  return {
    access: s.accessToken,
    refresh: s.refreshToken,
    hydrated: s.hydrated,
  };
}

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";
// const API_URL = process.env.EXPO_BASE_URL ?? BASE_URL;

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  withCredentials: false,
});

// Refresh queue handling
let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

function subscribe(cb: (token: string) => void) {
  queue.push(cb);
}

function publish(token: string) {
  queue.forEach((cb) => cb(token));
  queue = [];
}

// Request Interceptor: add token automatically
api.interceptors.request.use((config) => {
  // const token = authBridge.getAccessToken();
  const { access, hydrated } = getTokens();
  if (access && hydrated) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
    console.log("Attaching Bearer", access.slice(0, 12));
  }
  return config;
});

// Request interceptor: Handle  / refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    console.log("[api] interceptor caught an error:", {
      url: original?.url,
      status,
      retry: original?._retry,
      isRefreshing,
    });

    // Handdle  errors once per request
    // if ((status !== 401 && status !== 403 ) || original._retry) throw error;
    if (status !== 401 || original._retry) throw error;

    // Avoid refreshing if the refresh call itself failed
    if (original.url?.includes("/auth/refresh")) {
      console.log("[api] on /aut/refresh -> logout");
      await authBridge.callLogout();
      throw error;
    }

    original._retry = true;

    const doRefresh = async () => {
      // const refreshToken = authBridge.getRefreshToken();
      const { refresh, hydrated } = getTokens();
      console.log("[api] doRefresh: have refresh token?", !!refresh);
      if (!hydrated || !refresh) {
        console.log("[api] doRefresh: missing refresh token or not hidrateted");
        // await authBridge.callLogout();
        throw error;
      }

      console.log("[api] calling auth/refresh");
      const r = await axios.post(`${DEFAULT_BASE_URL}/auth/refresh`, {
        refresh_token: refresh,
      });

      const data = r.data as any;
      const newAccess = data.access_token;
      const newRefresh = data.refresh_token; // may or may not exist

      console.log("[api] refresh OK", {
        access: newAccess?.slice(0, 12),
        refresh: newRefresh ? newRefresh.slice(0, 12) : null,
      });

      // Update Zustand store (source of truth)
      const st = useAuth.getState();
      if (newRefresh) {
        await st.setTokens(newAccess, newRefresh);
      } else {
        await st.setAccessToken(newAccess);
      }

      return newAccess;
    };

    try {
      if (isRefreshing) {
        console.log("[api] refresh already in progress -> waiting");
        const newToken = await new Promise<string>((resolve) =>
          subscribe(resolve)
        );
        console.log("[api] got token from queue -> retrying original");
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        console.log("Refreshed");
        return api(original);
      }

      isRefreshing = true;
      const newToken = await doRefresh();
      isRefreshing = false;
      publish(newToken);
      console.log("[api] dpublished new token -> retrying original");
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (error) {
      console.log("[api] refresh failed:", error);
      isRefreshing = false;
      queue = [];
      // await authBridge.callLogout();
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
