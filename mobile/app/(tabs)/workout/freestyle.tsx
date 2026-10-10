import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useWorkoutSessionStore } from "@/src/store/workoutSessionStore";
import { exercises } from "@/src/mocks/exercises.mock";
import { ExerciseOptionsModal } from "@/src/features/workout/components/ExerciseOptionsModal";
import { ExerciseConfigModal } from "@/src/features/workout/components/ExerciseConfigModal";
import { WorkoutExerciseTable } from "@/src/features/workout/components/WorkoutExerciseTable";

export default function FreestyleWorkoutScreen() {
  const t = useTheme();
  const router = useRouter();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null,
  );

  const activeSession = useWorkoutSessionStore((state) => state.activeSession);

  const workoutExercises = activeSession?.exercises ?? [];
  const exerciseListEmpty = workoutExercises.length === 0;
  const removeExercise = useWorkoutSessionStore(
    (state) => state.removeExercise,
  );
  const updateExerciseConfig = useWorkoutSessionStore(
    (state) => state.updateExerciseConfig,
  );
  const ensureExerciseSets = useWorkoutSessionStore(
    (state) => state.ensureExerciseSets,
  );

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

  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(
    null,
  );

  const [targetSets, setTargetSets] = useState("");
  const [minReps, setMinReps] = useState("");
  const [maxReps, setMaxReps] = useState("");
  const [restSeconds, setRestSeconds] = useState("");

  const handleEditConfiguration = () => {
    const workoutExercise = workoutExercises.find(
      (item) => item.id === selectedExerciseId,
    );

    if (!workoutExercise) return;

    const config = workoutExercise.config;

    setTargetSets(String(config.targetSets ?? 3));
    setMinReps(String(config.targetRepsMin ?? 8));
    setMaxReps(String(config.targetRepsMax ?? 12));
    setRestSeconds(String(config.restSeconds ?? 120));

    setEditingExerciseId(workoutExercise.id);
    setSelectedExerciseId(null);
  };

  const handleRemoveExercise = () => {
    const workoutExerciseId = selectedExerciseId;
    if (!workoutExerciseId) return;

    const workoutExercise = workoutExercises.find(
      (item) => item.id === workoutExerciseId,
    );

    const exerciseTitle = exercises.find(
      (item) => item.id === workoutExercise?.exerciseId,
    )?.title;

    setSelectedExerciseId(null);

    Alert.alert(
      exerciseTitle ?? "Remove exercise",
      "Remove this exercise from your workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeExercise(workoutExerciseId),
        },
      ],
    );
  };

  const parseOptionalNumber = (value: string): number | null => {
    if (value.trim() === "") return null;

    const number = Number(value);
    return Number.isInteger(number) ? number : null;
  };
  const handleSaveConfiguration = () => {
    const sets = parseOptionalNumber(targetSets);
    const min = parseOptionalNumber(minReps);
    const max = parseOptionalNumber(maxReps);
    const rest = parseOptionalNumber(restSeconds);
    if (!editingExerciseId) return;

    // Validate required values
    if (sets === null || min === null || max === null || rest === null) {
      Alert.alert(
        "Invalid configuration",
        "Please enter all configuration values.",
      );
      return;
    }
    // Validate ranges
    if (sets < 1 || min < 1 || max < min || rest < 0) {
      Alert.alert(
        "Invalid configuration",
        "Sets and reps must be positive, maximum reps must be at least minimum reps, and rest cannot be negative.",
      );
      return;
    }
    // Save to Zustand
    updateExerciseConfig(editingExerciseId, {
      targetSets: sets,
      targetRepsMin: min,
      targetRepsMax: max,
      restSeconds: rest,
    });

    // Generate missing sets
    ensureExerciseSets(editingExerciseId);

    // Temporary debugging
    const updatedExercise = useWorkoutSessionStore
      .getState()
      .activeSession?.exercises.find(
        (exercise) => exercise.id === editingExerciseId,
      );

    console.log("Generated sets:", updatedExercise?.sets);
    console.log("Number of sets:", updatedExercise?.sets.length);

    // Close the modal
    setEditingExerciseId(null);
  };

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
          {exerciseListEmpty && (
            <Text style={[styles.emptyText, { color: t.colors.textMuted }]}>
              No exercises added yet.
            </Text>
          )}

          <WorkoutExerciseTable
            workoutExercises={workoutExercises}
            onOpenOptions={setSelectedExerciseId}
            onNavigate={(exerciseId, workoutExerciseId) =>
              router.push({
                pathname: "/workout/exercise",
                params: { exerciseId, workoutExerciseId },
              })
            }
            onAdd={() => router.push("/workout/exercise-picker")}
          />
        </View>
      )}

      {!exerciseListEmpty && (
        <View style={styles.completeArea}>
          <Pressable
            style={[styles.completeBtn, { backgroundColor: t.colors.primary }]}
            onPress={() => console.log("Complete workout pressed")}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={22}
              color={t.colors.onPrimary}
            />
            <Text style={[styles.completeText, { color: t.colors.onPrimary }]}>
              Complete Workout
            </Text>
          </Pressable>
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

      <ExerciseConfigModal
        visible={editingExerciseId !== null}
        onClose={() => setEditingExerciseId(null)}
        onSave={handleSaveConfiguration}
        targetSets={targetSets}
        onTargetSetsChange={setTargetSets}
        minReps={minReps}
        onMinRepsChange={setMinReps}
        maxReps={maxReps}
        onMaxRepsChange={setMaxReps}
        restSeconds={restSeconds}
        onRestSecondsChange={setRestSeconds}
      />
      <ExerciseOptionsModal
        visible={selectedExerciseId !== null}
        onClose={() => setSelectedExerciseId(null)}
        onEditConfiguration={handleEditConfiguration}
        onRemove={handleRemoveExercise}
      />
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

  workoutContent: {
    flex: 1,
    minHeight: 0,
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
  emptyText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 14,
  },
});
