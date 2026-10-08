import { Text, View, StyleSheet, Pressable, TextInput } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { WorkoutExerciseCard } from "@/src/components/WorkoutExerciseCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function FreestyleWorkoutScreen() {
  const t = useTheme();
  const router = useRouter();

  const today = new Date();

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const [activeTab, setActiveTab] = useState<"exercises" | "notes">(
    "exercises",
  );
  const [notes, setNotes] = useState("");

  const exerciseListEmpty = true;

  return (
    <BaseLayout>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.colors.text }]}>
          Freestyle Workout
        </Text>
        <Text style={[styles.date, { color: t.colors.textMuted }]}>
          {formattedDate}
        </Text>
      </View>

      <View style={styles.tabBar}>
        {(["exercises", "notes"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  activeTab === tab ? t.colors.primary : t.colors.border,
                borderBottomWidth: activeTab === tab ? 3 : 1,
              },
            ]}
          >
            <Text
              style={{
                color:
                  activeTab === tab ? t.colors.primary : t.colors.textMuted,
                fontWeight: activeTab === tab ? "700" : "500",
              }}
            >
              {tab === "exercises" ? "Exercises" : "Notes"}
            </Text>
          </Pressable>
        ))}
      </View>
      {activeTab === "exercises" && (
        <View style={styles.workoutContent}>
          <View style={styles.exerciseBlock}>
            <WorkoutExerciseCard
              title="Barbell Squat"
              summary="3×10 · 20kg · 2 min rest"
            />
            <WorkoutExerciseCard
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
            onPress={() => {
              router.push("/workout/exercise-picker");
            }}
          >
            <Ionicons name="add-outline" size={20} color={t.colors.primary} />
            <Text style={[styles.addText, { color: t.colors.primary }]}>
              Add Exercise
            </Text>
          </Pressable>
          {!exerciseListEmpty && (
            <View style={styles.completeArea}>
              <Pressable
                style={({ pressed }) => [
                  styles.completeBtn,
                  {
                    backgroundColor: t.colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => {
                  console.log("Complete workout pressed");
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color={t.colors.onPrimary}
                />
                <Text
                  style={[styles.completeText, { color: t.colors.onPrimary }]}
                >
                  Complete Workout
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {activeTab === "notes" && (
        <View style={styles.notesContent}>
          <TextInput
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="How did your workout go? Technique, discomfort, progress..."
            placeholderTextColor={t.colors.textMuted}
            textAlignVertical="top"
            style={[
              styles.notesInput,
              {
                color: t.colors.text,
                backgroundColor: t.colors.surface,
                borderColor: t.colors.border,
              },
            ]}
          />
        </View>
      )}
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

  addText: { fontWeight: "900" },

  pressed: { opacity: 0.75 },
  workoutContent: {
    marginTop: 10,
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 8,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },

  notesContent: {
    marginTop: 16,
  },

  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 160,
    fontSize: 15,
  },
  completeArea: {
    marginTop: 24,
    marginBottom: 16,
  },

  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    borderRadius: 12,
  },

  completeText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
