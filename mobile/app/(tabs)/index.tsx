import { Text, View, StyleSheet } from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";
import { Container } from "@/src/components/Container";
import WeekDays from "@/src/components/WeekDays";

export default function Index() {
  const t = useTheme();
  const user = useAuth((s) => s.user);

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

      <WeekDays/>

      <Container variant="console"><Text>Console</Text></Container>
      <Container variant="default"><Text>Default</Text></Container>
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
