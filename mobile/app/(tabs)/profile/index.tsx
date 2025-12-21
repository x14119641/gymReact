import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { BaseLayout } from "@/src/components/BaseLayout";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { loadMyProfile } from "@/src/services/profile";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const t = useTheme();

  const user = useAuth((s) => s.user);

  const hydrated = useAuth((s) => s.hydrated);
const accessToken = useAuth((s) => s.accessToken);

useEffect(() => {
  if (!hydrated) return;
  if (!accessToken) {
    setLoading(false);
    setProfile(null);
    return;
  }

  loadMyProfile()
    .then(setProfile)
    .catch((e) => {
      console.log("loadMyProfile failed:", e?.response?.status, e?.message);
      setProfile(null);
    })
    .finally(() => setLoading(false));
}, [hydrated, accessToken]);
  if (loading) return <ActivityIndicator />;

  if (!profile) {
    return (
      <BaseLayout>
        <View>
          <Text>No profile yet</Text>
        </View>
      </BaseLayout>
    );
  }

  return (
    <View>
      <Text style={[s.title, { color: t.colors.text }]}>
        Hello 👋 ({user?.username}!)
      </Text>
      <Text>Goal: {profile.goal}</Text>
      <Text>user_id: {profile.user_id}</Text>
      <Text>INjuries: {profile.injuries}</Text>
      <Text>sports_background: {profile.sports_background}</Text>
      <Text>Completed at: {profile.onboarding_completed_at}</Text>
      <Text>days_per_week: {profile.days_per_week}</Text>
      <Text>created_at: {profile.created_at}</Text>
      <Text>Blassxaasda</Text>
    </View>
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
