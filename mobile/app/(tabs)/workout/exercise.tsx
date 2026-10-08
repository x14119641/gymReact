import { Text, View, StyleSheet, Pressable } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { SurfaceCard } from "@/src/components/SurfaceCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function ExerciseScreen() {
  const t = useTheme();
  const router = useRouter();

  return (
    <BaseLayout>
        <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={t.colors.primary} />
      </Pressable>
      <SurfaceCard>
        <View style={styles.header}>
            <Text>Exercise</Text>
        </View>
        
      </SurfaceCard>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
    backBtn: {
    alignSelf: "flex-start",
    padding: 6,
  },
  pressed: { opacity: 0.75 },
  header: {
    gap: 4,
  },
})