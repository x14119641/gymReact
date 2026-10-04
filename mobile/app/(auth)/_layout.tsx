import { Stack } from "expo-router";
import { useAuth } from "@/src/store/auth";

export default function AuthLayout() {
  const hydrated = useAuth((s) => s.hydrated);
  const accessToken = useAuth((s) => s.accessToken);

  // Keep auth screens hidden while RootLayout handles startup and navigation.
  if (!hydrated || accessToken) return null;

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
