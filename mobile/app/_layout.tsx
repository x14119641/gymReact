import { Stack } from "expo-router";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { Text, View } from "react-native";
import { use, useEffect } from "react";

export default function RootLayout() {
  const accessToken = useAuth((r) => r.accessToken);
  const user = useAuth(r=>r.user)
  // const refreshToken = useAuth((r) => r.refreshToken);
  const loadMe = useAuth(r=>r.loadMe);
  const hasHydrated = useAuth.persist.hasHydrated();

  // After rehidration fetch user only once if token
  useEffect(()=> {
    if(hasHydrated && accessToken && !user) {
      loadMe().catch(e=>console.log("[_Layout] loadMe error",e))
    }
  }, [hasHydrated, accessToken, user, loadMe]);
  if (!hasHydrated) {
    return (
      <ThemeProvider>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Loading</Text>
        </View>
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* If token go to tabs, otherwise login page */}
        {accessToken ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </ThemeProvider>
  );
}
