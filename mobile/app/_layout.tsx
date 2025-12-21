import { Stack, Redirect } from "expo-router";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { loadMyProfile } from "@/src/services/profile";

export default function RootLayout() {
  const accessToken = useAuth((r) => r.accessToken);
  const user = useAuth((r) => r.user);
  const loadMe = useAuth((r) => r.loadMe);
  const hasHydrated = useAuth.persist.hasHydrated();

  const [bootstrapped, setBootstrapped] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!accessToken) {
      setBootstrapped(true);
      return;
    }

    (async () => {
      try {
        await loadMe();

        const profile = await loadMyProfile();
        setNeedsOnboarding(!profile);
      } catch (error) {
        console.log("[_Layout] Error:", error);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, [hasHydrated, accessToken, loadMe]);

  if (!hasHydrated || !bootstrapped) {
    return (
      <ThemeProvider>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      </ThemeProvider>
    );
  }

  // No token -> auth stack
  if (!accessToken) {
    return (
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
        </Stack>
      </ThemeProvider>
    );
  }

  // Token exists but user failed to load -> go to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Token + user loaded but profile doesn't exist -> onboarding
  if (needsOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  // Otherwise -> tabs
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
