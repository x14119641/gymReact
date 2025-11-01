import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { UseTheme } from "@/src/theme/ThemeProvider";

export default function Index() {
  const t = UseTheme();
  return (
    <View style={[styles.container, { backgroundColor: t.colors.bg }]}>
      <Text style={[styles.title, { color: t.colors.text }]}>Home screen</Text>
      <Link href="/about" style={[styles.button, { color: t.colors.accent }]}>
        Go to About Screen
      </Link>
    </View>
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
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
