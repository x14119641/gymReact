import { create } from "zustand";
import type { ProfileUserRecord } from "@/src/types/user";
import { loadMyProfile } from "../services/profile";
import { persist } from "zustand/middleware";

type ProfileStatus = "idle" | "loading" | "ready" | "missing" | "error";

type ProfileRecordState = {
  status: ProfileStatus;
  profile: ProfileUserRecord | null;
  error: string | null;

  loadProfileMe: () => Promise<void>;
  clearProfile: () => void;
};

export const userProfileRecord = create<ProfileRecordState>()((set) => ({
  status: "idle",
  profile: null,
  error: null,

  clearProfile: () => set({ status: "idle", profile: null, error: null }),

  loadProfileMe: async () => {
    set({ status: "loading", error: null });
    const res = await loadMyProfile();
    console.log("[profileStore] loadMyProfile result:", res);

    const isMissing =
      res == null || // null or undefined
      (typeof res === "object" &&
        !Array.isArray(res) &&
        Object.keys(res as any).length === 0);

    if (isMissing) {
      set({ status: "missing", profile: null });
      console.log("[profileStore] setting missing");
      return;
    }
    set({ status: "ready", profile: res });
    console.log("[profileStore] setting ready");
  },
}));
