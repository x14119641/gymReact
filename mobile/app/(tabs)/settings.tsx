// app/index.tsx (or any screen)
import { View, Text, StyleSheet, Button } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useRouter } from "expo-router";
import {logout as logoutApi} from "@/src/services/auth"
import { useAuth } from "@/src/store/auth";
import { useState } from "react";


export default function SettingsScreen() {
  const t = useTheme();
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function  handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await logoutApi();
    } catch (e) {
      console.log("Error in Seeings Screen:", e);
    } finally {
      await logout();
      router.replace("/(auth)/login");
      setLoading(false);
    }
  }

  return (
    <BaseLayout>
      <Text style={[s.title, { color: t.colors.text }]}>
        Settings Page
      </Text>

      <View
        style={[
          s.card,
          {
            backgroundColor: t.colors.card,
            borderColor: t.colors.border,
            shadowColor: t.colors.shadow,
          },
        ]}
      >
        <Button title={loading ? "Logging out.." : "Logout"} onPress={handleLogout} />
      </View>
    </BaseLayout>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
    elevation: 4, // Android shadow
  },
});
