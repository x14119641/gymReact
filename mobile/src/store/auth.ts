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
  token: string | null;
  setToken: (t: string | null) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      hydrated: false,

      setToken: async (t) => {
        set({ token: t });
      },
      logout: async () => {
        set({ token: null });
      },
    }),
    {
      name: "auth-secure",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
