import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { Card } from "@/src/components/Card";
import { SettingRow } from "@/src/components/SettingRow";
import { mockProfile } from "@/src/mocks/profile.mock";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Container } from "@/src/components/Container";

export default function ProfileScreen() {
  //   Mock data
  const t = useTheme();
  const route = useRouter();
  const [theme, setTheme] = useState(mockProfile.settings.theme);
  const [weightUnit, setWeightUnit] = useState(mockProfile.settings.weightUnit);

  const [darkMode, setDarkMode] = useState(theme === "dark");

  return (
    <ScrollView style={{ backgroundColor: t.colors.bg, flex: 1, marginHorizontal:12}}>
      <Text style={[s.title, { color: t.colors.title }]}>Profile</Text>
      <Container variant="default" density="compact">
        <Text style={[s.subtitle, {color:t.colors.accent}]}>
          Account
        </Text>
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
      </Container>
      
      <Text style={s.hint}>Mock only. No backend calls.</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B0F14" },
  container: { padding: 16, paddingBottom: 32 },

  title: { fontSize: 28, fontWeight: "800" , marginTop:16, textAlign:"center"},
  subtitle: { textAlign:"center", fontSize:16, fontWeight:"700" },

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
    borderColor: "#3B1E1E",
    backgroundColor: "#160B0B",
    marginTop: 6,
  },
  logoutIcon: { color: "#FF6B6B" },
  logoutText: { color: "#FF6B6B", fontWeight: "900" },

  pressed: { opacity: 0.75 },

  hint: { marginTop: 12, color: "#6E8193", fontSize: 12, textAlign: "center" },
});



