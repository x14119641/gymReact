import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";
import { Card } from "@/src/components/Card";
import WeekDaysCard from "@/src/components/WeekDaysComponent";


export default function Index() {
  const t = useTheme();
  const user = useAuth(s => s.user);

  return (
    <BaseLayout>
      <View>
        <Card>
          <Text style={[styles.title, {color:t.colors.text}]}>Hello <Text style={{color:t.colors.accent}}>{user?.username}</Text></Text>
          <Text style={[styles.subText, {color:t.colors.text}]}>Subtext</Text>
          <Text style={[styles.subText, {color:t.colors.text}]}>More Text</Text>
        </Card>
      </View>
      <WeekDaysCard />
      <View style={styles.container}>
        <Text style={[styles.title, { color: t.colors.text }]}>
          Home screen
        </Text>
        <Text style={[styles.subText, {color:t.colors.subtext}]}>{user?.username}</Text>
        <Link href="/about" style={[styles.button, { color: t.colors.accent }]}>
          Go to About Screen
        </Link>
      </View>
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
