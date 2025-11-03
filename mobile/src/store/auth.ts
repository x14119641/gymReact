import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage } from "zustand/middleware";
import { loadMe as loadMeApi } from "../services/auth";

const secureStorage = {
  getItem: async (key: string) => (await SecureStore.getItemAsync(key)) ?? null,
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

type User = {id:number, email:string, username:string}

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh:string) => Promise<void>;
  setAccessToken:(token:string) => Promise<void>;
  user: User | null;
  loadMe:() => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user:null,

      setTokens: async (access, refresh) => {
        set({ accessToken: access, refreshToken:refresh });
      },
      setAccessToken: async (token) => {
        set({accessToken:token});
      },
      loadMe: async () => {
        const token = get().accessToken;
        if (!token) { set({ user:null }); return;}
        try {
          const me = await loadMeApi(token);
          set({ user: me });
        } catch (error:any) {
          console.log("Error in auth:", error);
          set({user:null, accessToken:null, refreshToken: null});
        }
        
      },
      logout: async () => {
        set({ user: null, accessToken: null, refreshToken:null });
      },
    }),
    {
      name: "auth-secure",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
