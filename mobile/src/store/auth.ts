import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { persist, createJSONStorage } from "zustand/middleware";
import { loadMe as loadMeApi, login as loginApi, logout as logoutApi } from "../services/auth";
import { authBridge } from "../services/authBridge";


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
  user: User | null;

  setTokens: (access: string, refresh:string) => Promise<void>;
  setAccessToken:(token:string) => Promise<void>;
  
  doLogin: (email:string, password:string) => Promise<void>;
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
        authBridge.setAccessToken(access);
        authBridge.setRefreshToken(refresh);
        set({ accessToken: access, refreshToken:refresh });
      },
      setAccessToken: async (token) => {
        authBridge.setAccessToken(token)
        set({accessToken:token});
      },
      loadMe: async () => {
        const token = get().accessToken;
        if (!token) { set({ user:null }); return;}
        try {
          const res = await loadMeApi();
          set({ user: res.data });
        } catch (error:any) {
          console.log("Error in auth:", error);
          set({user:null, accessToken:null, refreshToken: null});
        }
        
      },
      doLogin: async (username, password) => {
        const res = await loginApi(username, password);
        await get().setTokens(res.data.access_token, res.data.refresh_token);
        await get().loadMe();
      },
      logout: async () => {
        try { await logoutApi(); } catch  {}
        authBridge.setAccessToken(null);
        authBridge.setRefreshToken(null);
        set({ user: null, accessToken: null, refreshToken:null });
      },
    }),
    {
      name: "auth-secure",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
