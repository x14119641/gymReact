import { Stack, useRouter, useSegments } from "expo-router";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { userProfileRecord } from "@/src/store/profile";
import { setAuthRuntime } from "@/src/services/authRuntime";
import { Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Platform } from "react-native";

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";

export const unstable_settings = {
  initialRouteName: "index",
};

// runtime bridge for axios interceptor (ok to keep here)
setAuthRuntime({
  getTokens: () => {
    const s = useAuth.getState();
    return {
      access: s.accessToken,
      refresh: s.refreshToken,
      hydrated: s.hydrated,
    };
  },
  logout: () => useAuth.getState().logout(),
  setTokens: (access, refresh) => {
    const s = useAuth.getState();
    return refresh ? s.setTokens(access, refresh) : s.setAccessToken(access);
  },
});

function LoadingScreen() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading</Text>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const accessToken = useAuth((s) => s.accessToken);
  const refreshToken = useAuth((s) => s.refreshToken);
  const user = useAuth((s) => s.user);

  // best: use a reactive "hydrated" boolean stored in zustand
  const hydrated = useAuth((s) => s.hydrated);

  const profileStatus = userProfileRecord((s) => s.status);

  const [bootstrapped, setBootstrapped] = useState(false);

  // 1) BOOTSTRAP: silent refresh (once) + loadMe + loadProfileMe
  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;
    

    (async () => {
      try {
        setBootstrapped(false);

        // A) If no access but have refresh -> silent refresh
        if (
          !accessToken &&
          refreshToken
        ) {
          try {
            console.log("[root] silent refresh on boot");
            const r = await axios.post(
              `${DEFAULT_BASE_URL}/auth/refresh`,
              { refresh_token: refreshToken },
              { headers: { "Content-Type": "application/json" } }
            );

            const newAccess = r.data?.access_token;
            const newRefresh = r.data?.refresh_token ?? null;

            if (!newAccess)
              throw new Error("No access_token in refresh response");
            await useAuth.getState().setTokens(newAccess, newRefresh);
          } catch (e) {
            console.log("[root] silent refresh failed -> logout");
            await useAuth.getState().logout();
            userProfileRecord.getState().clearProfile();
            return;
          }
        }

        // B) After silent refresh, if still no access -> logged out state
        if (!useAuth.getState().accessToken) {
          userProfileRecord.getState().clearProfile();
          return;
        }

        // C) Load user
        await useAuth.getState().loadMe();

        // D) Load profile status if needed
        const ps = userProfileRecord.getState().status;
        if (ps === "idle" || ps === "error") {
          await userProfileRecord.getState().loadProfileMe();
        }
      } catch (e) {
        await useAuth.getState().logout();
        userProfileRecord.getState().clearProfile();
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated]); // IMPORTANT: only hydrated

  // 2) NAV GATING: choose correct group and replace only when needed
  const currentGroup = segments[0]; // "(auth)" | "(tabs)" | "(onboarding)" | undefined

  const targetGroup = useMemo(() => {
    if (!bootstrapped) return null;
    if (!accessToken) return "(auth)";
    if (!user) return null; // wait until loadMe finished
    if (profileStatus === "missing") return "(onboarding)";
    return "(tabs)";
  }, [accessToken, user, profileStatus, bootstrapped]);

  useEffect(() => {
    if (!hydrated || !bootstrapped) return;
    if (!targetGroup) return;

    if (currentGroup !== targetGroup) {
      if (targetGroup === "(auth)") router.replace("/(auth)/login");
      if (targetGroup === "(onboarding)") router.replace("/(onboarding)");
      if (targetGroup === "(tabs)") router.replace("/(tabs)");
    }
  }, [hydrated, bootstrapped, targetGroup, currentGroup, router]);

  if (!hydrated || !bootstrapped) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
