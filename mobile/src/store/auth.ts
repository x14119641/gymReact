import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage } from "zustand/middleware";

const secureStorage = {
  getItem: async (key: string) => (await SecureStore.getItemAsync(key)) ?? null,
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh:string) => Promise<void>;
  setAccessToken:(token:string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,

      setTokens: async (access, refresh) => {
        set({ accessToken: access, refreshToken:refresh });
      },
      setAccessToken: async (token) => {
        set({accessToken:token});
      },
      logout: async () => {
        set({ accessToken: null, refreshToken:null });
      },
    }),
    {
      name: "auth-secure",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
