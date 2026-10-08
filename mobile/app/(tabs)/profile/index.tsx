import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { SettingRow } from "@/src/components/SettingRow";
import { mockProfile } from "@/src/mocks/profile.mock";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import { useAuth } from "@/src/store/auth";

export default function ProfileScreen() {
  //   Mock data
  const t = useTheme();
  const route = useRouter();
  const [weightUnit, setWeightUnit] = useState(mockProfile.settings.weightUnit);

  const logout = useAuth((s) => s.logout);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <ScrollView
        style={{
          backgroundColor: t.colors.background,
          flex: 1,
          marginHorizontal: 12,
        }}
      >
        <Text style={[s.title, { color: t.colors.text }]}>Profile</Text>
        <SurfaceCard>
          <Text style={[s.subtitle, { color: t.colors.text }]}>Account</Text>
          <SettingRow
            icon="mail-outline"
            label="Email"
            value={mockProfile.user.email}
          />
          <SettingRow
            icon="person-outline"
            label="Username"
            value={mockProfile.user.username}
          />
        </SurfaceCard>

        <SurfaceCard>
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            right={
              <Switch
                accessibilityLabel="Dark Mode"
                value={t.scheme === "dark"}
                onValueChange={(enabled) =>
                  t.setMode(enabled ? "dark" : "light")
                }
                trackColor={{
                  false: t.colors.borderStrong,
                  true: t.colors.primary,
                }}
                thumbColor={t.colors.surface}
                ios_backgroundColor={t.colors.borderStrong}
              />
            }
          />
        </SurfaceCard>

        <Text style={[s.hint, { color: t.colors.textMuted }]}>
          Mock only. No backend calls.
        </Text>

        <Pressable
          style={({ pressed }) => [
            s.logoutBtn,
            { backgroundColor: t.colors.surface, borderColor: t.colors.border },
            pressed && s.pressed,
          ]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={t.colors.danger} />
          <Text style={[s.logoutText, { color: t.colors.danger }]}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B0F14" },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: { textAlign: "center", fontSize: 16, fontWeight: "700" },

  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 12,
    letterSpacing: 1.2,
    color: "#8AA0B3",
    fontWeight: "800",
  },

  divider: { height: 1, backgroundColor: "#1B2A3A" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
  },
  logoutText: { fontWeight: "900" },

  pressed: { opacity: 0.75 },

  hint: { marginTop: 12, fontSize: 12, textAlign: "center" },
});
