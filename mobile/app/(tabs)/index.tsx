import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useAuth } from "@/src/store/auth";


export default function Index() {
  const t = useTheme();
  const user = useAuth(s => s.user);

  return (
    <BaseLayout>
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
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  subText: {
    fontSize: 18,
    fontWeight: "700",
    marginTop:8,
    marginBottom: 16,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
