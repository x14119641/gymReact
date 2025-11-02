import { Stack } from "expo-router";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { Text, View } from "react-native";

export default function RootLayout() {
  const token = useAuth((r) => r.token);
  const hasHydrated = useAuth.persist.hasHydrated();

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
        {token ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </ThemeProvider>
  );
}
