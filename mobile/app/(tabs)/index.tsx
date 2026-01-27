import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";
import { userProfileRecord } from "@/src/store/profile";
import { Container } from "@/src/components/Container";
import WeekDays from "@/src/components/WeekDays";

export default function Home() {
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
      <View style={{ margin: 12 }}>
        <Container>
          <Text style={[styles.title, { color: t.colors.text }]}>
            Hello{" "}
            <Text style={{ color: t.colors.accent }}>{user?.username}</Text>
          </Text>
          <Text style={[styles.subText, { color: t.colors.text }]}>
            Subtext
          </Text>
          <Text style={[styles.subText, { color: t.colors.text }]}>
            More Text
          </Text>
        </Container>
      </View>

      <WeekDays />
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
