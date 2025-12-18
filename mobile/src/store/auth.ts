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
  setAccessToken:(token:string |null) => Promise<void>;
  
  doLogin: (email:string, password:string) => Promise<void>;
  loadMe:() => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => {
      // register callbacks once when store is created
      authBridge.setOnLogout(() => get().logout());
      authBridge.setOnAccessToken((t) => get().setAccessToken(t)); 

      return {
        accessToken: null,
        refreshToken: null,
        user: null,

        setTokens: async (access, refresh) => {
          authBridge.setAccessToken(access);
          authBridge.setRefreshToken(refresh);
          set({ accessToken: access, refreshToken: refresh });
        },

        // 🔧 change this to accept null too
        setAccessToken: async (token) => {
          authBridge.setAccessToken(token);
          set({ accessToken: token });
        },

        loadMe: async () => {
          const token = get().accessToken;
          if (!token) { set({ user: null }); return; }
          try {
            const res = await loadMeApi();
            set({ user: res.data });
          } catch (error: any) {
            console.log("Error in loadME: ", error)
            set({ user: null, accessToken: null, refreshToken: null });
          }
        },

        doLogin: async (email, password) => {
          const res = await loginApi(email, password);
          await get().setTokens(res.data.access_token, res.data.refresh_token);
          await get().loadMe();
        },

        logout: async () => {
          try { await logoutApi(); } catch {}
          authBridge.setAccessToken(null);
          authBridge.setRefreshToken(null);
          set({ user: null, accessToken: null, refreshToken: null });
          console.log("[store] logout called");
        },
      };
    },
    {
      name: "auth-secure",
      storage: createJSONStorage(() => secureStorage),

      // ✅ you already added this — keep it
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        authBridge.setAccessToken(state.accessToken);
        authBridge.setRefreshToken(state.refreshToken);
      },
    }
  )
);


