import { Text, View, StyleSheet, Pressable } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Container } from "@/src/components/Container";
import { ExerciseContainer } from "@/src/components/ExerciseContainer";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FreestyleWorkoutScreen() {
  const t = useTheme();

  const today = new Date();

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <BaseLayout>
      <Container variant="default" density="compact">
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.colors.text }]}>
            Freestyle Workout
          </Text>
          <Text style={[styles.date, { color: t.colors.textMuted }]}>
            {formattedDate}
          </Text>
        </View>
      </Container>
      <Container variant="default" density="compact">
        <View style={styles.exerciseBlock}>
          <ExerciseContainer
            title="Barbell Squat"
            summary="3×10 · 20kg · 2 min rest"
          />
          <ExerciseContainer
            title="Sumo Squat"
            summary="3×10 · 0kg · 2 min rest"
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.addBtn,
            {
              backgroundColor: t.colors.surface,
              borderColor: t.colors.highlight,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="add-outline" size={20} color={t.colors.highlight} />
          <Text style={[styles.AddText, { color: t.colors.highlight }]}>
            Add Exercise
          </Text>
        </Pressable>
      </Container>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  date: {
    fontSize: 14,
  },
  exerciseBlock: {
    gap: 16,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
  },

  AddText: { fontWeight: "900" },

  pressed: { opacity: 0.75 },
});
