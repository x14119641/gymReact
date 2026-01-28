import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";
import { userProfileRecord } from "@/src/store/profile";
import WeekDays from "@/src/components/WeekDays";
import HeroStatsCard from "@/src/components/HeroStatsCard";

export default function HomeScreen() {
  const t = useTheme();
  const accessToken = useAuth((s) => s.accessToken);
  const user = useAuth((s) => s.user);
  const status = userProfileRecord((s) => s.status);

  // load profile once when logged in
  useEffect(() => {
    if (!accessToken || !user) return;
    if (status !== "idle" && status !== "error") return;

    userProfileRecord
      .getState()
      .loadProfileMe()
      .catch(() => {
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
    <BaseLayout>
      <HeroStatsCard 
      username={user?.username}
      strengthScore={75}
      streakDays={3}
      fatigueLevel="yellow"
      // fatigueText="Rising"
      coachNote="Volume tight. Keep 1-2 reps n reserve."
      />

      <WeekDays />
    </BaseLayout>
  );
}
