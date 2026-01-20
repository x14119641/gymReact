import { useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/store/auth";
import { userProfileRecord } from "@/src/store/profile";

export default function Home() {
  const accessToken = useAuth((s) => s.accessToken);
  const user = useAuth((s) => s.user);
  const status = userProfileRecord((s) => s.status);

  // load profile once when logged in
  useEffect(() => {
    if (!accessToken || !user) return;
    if (status !== "idle" && status !== "error") return;

    userProfileRecord.getState().loadProfileMe().catch(() => {
      // ignore, status becomes "error"
    });
  }, [accessToken, user, status]);

  // redirect to onboarding if missing
  useEffect(() => {
    if (!accessToken || !user) return;
    if (status !== "missing") return;

    const id = requestAnimationFrame(() => {
      // router.replace("/(onboarding)");
    });
    return () => cancelAnimationFrame(id);
  }, [accessToken, user, status]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
