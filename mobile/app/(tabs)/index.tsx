import { useEffect, useState } from "react";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Pressable, Text, StyleSheet } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";
import { userProfileRecord } from "@/src/store/profile";
import WeekDays from "@/src/components/WeekDays";
import HeroStatsCard from "@/src/components/HeroStatsCard";
import { AddActivityModal } from "@/src/components/AddActivityModal";

export default function HomeScreen() {
  const t = useTheme();
  const accessToken = useAuth((s) => s.accessToken);
  const user = useAuth((s) => s.user);
  const status = userProfileRecord((s) => s.status);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

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

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor: t.colors.primary,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => setAddMenuVisible(true)}
      >
        <Text style={[styles.addButtonText, { color: t.colors.onPrimary }]}>
          +
        </Text>
      </Pressable>
      <AddActivityModal
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
      />
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: "absolute",
    right: 32,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "500",
  },
});
