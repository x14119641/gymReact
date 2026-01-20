import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Platform } from "react-native";
// import { authBridge } from "./authBridge";
import { getTokens, runtimeLogout, runtimeSetTokens } from "./authRuntime";

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";
// const API_URL = process.env.EXPO_BASE_URL ?? BASE_URL;

export const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  withCredentials: false,
});

// Refresh queue handling
let isRefreshing = false;
let queue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

function subscribe(resolve: (t: string) => void, reject: (e: any) => void) {
  queue.push({ resolve, reject });
}

function publish(token: string) {
  queue.forEach(({ resolve }) => resolve(token));
  queue = [];
}

function failQueue(err: any) {
  queue.forEach(({ reject }) => reject(err));
  queue = [];
}

// Request Interceptor: add token automatically
api.interceptors.request.use((config) => {
  // const token = authBridge.getAccessToken();
  const { access, hydrated } = getTokens();
  console.log("->", config.method?.toUpperCase(), config.url);

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

    // 1) Only handle 401 once per request
    if (status !== 401 || original._retry) throw error;

    // 2) Never refresh on auth endpoints
    const noRefreshPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot",
      "/auth/reset",
    ];
    if (noRefreshPaths.some((p) => original.url?.includes(p))) {
      throw error;
    }

    // 3) If refresh itself failed -> logout (safety)
    if (original.url?.includes("/auth/refresh")) {
      console.log("[api] on /auth/refresh -> logout");
      await runtimeLogout();
      throw error;
    }

    // mark original request as retried (prevents loops)
    original._retry = true;

    const doRefresh = async () => {
      const { refresh, hydrated } = getTokens();
      console.log("[api] doRefresh: have refresh token?", !!refresh);

      if (!hydrated || !refresh) {
        console.log("[api] doRefresh: missing refresh token or not hydrated");
        await runtimeLogout();
        throw error;
      }

      console.log("[api] calling /auth/refresh");
      const r = await axios.post(
        `${DEFAULT_BASE_URL}/auth/refresh`,
        { refresh_token: refresh },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = r.data as any;
      const newAccess = data.access_token;
      const newRefresh = data.refresh_token; // may or may not exist

      console.log("[api] refresh OK", {
        access: newAccess?.slice(0, 12),
        refresh: newRefresh ? newRefresh.slice(0, 12) : null,
      });

      await runtimeSetTokens(newAccess, newRefresh ?? null);
      return newAccess;
    };

    try {
      if (isRefreshing) {
        console.log("[api] refresh already in progress -> waiting");
        const newToken = await new Promise<string>((resolve, reject) =>
          subscribe(resolve, reject)
        );

        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      isRefreshing = true;
      const newToken = await doRefresh();
      isRefreshing = false;

      publish(newToken);

      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (e) {
      console.log("[api] refresh failed:", e);
      isRefreshing = false;
      failQueue(e);
      await runtimeLogout();
      throw error;
    }
  }
);
