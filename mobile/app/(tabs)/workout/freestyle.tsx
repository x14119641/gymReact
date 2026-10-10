import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useWorkoutSessionStore } from "@/src/store/workoutSessionStore";
import { exercises } from "@/src/mocks/exercises.mock";
import { ExerciseOptionsModal } from "@/src/features/workout/components/ExerciseOptionsModal";

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
  // const updateExerciseConfig = useWorkoutSessionStore(
  //   (state) => state.updateExerciseConfig,
  // );

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

    setTargetSets(config.targetSets?.toString() ?? "");
    setMinReps(config.targetRepsMin?.toString() ?? "");
    setMaxReps(config.targetRepsMax?.toString() ?? "");
    setRestSeconds(config.restSeconds?.toString() ?? "");

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

          <View style={styles.exerciseTable}>
            {!exerciseListEmpty && (
              <View style={styles.tableHeader}>
                <Text
                  style={[
                    styles.exerciseColumn,
                    styles.columnLabel,
                    { color: t.colors.textMuted },
                  ]}
                >
                  EXERCISE
                </Text>
                <Text
                  style={[
                    styles.setsColumn,
                    styles.columnLabel,
                    { color: t.colors.textMuted },
                  ]}
                >
                  SETS
                </Text>
                <Text
                  style={[
                    styles.repsColumn,
                    styles.columnLabel,
                    { color: t.colors.textMuted },
                  ]}
                >
                  REPS
                </Text>
                <Text
                  style={[
                    styles.restColumn,
                    styles.columnLabel,
                    { color: t.colors.textMuted },
                  ]}
                >
                  REST
                </Text>
                <View style={styles.menuColumn} />
              </View>
            )}

            {workoutExercises.map((workoutExercise) => {
              const exercise = exercises.find(
                (item) => item.id === workoutExercise.exerciseId,
              );

              if (!exercise) return null;

              const config = workoutExercise.config;

              const reps =
                config.targetRepsMin != null && config.targetRepsMax != null
                  ? `${config.targetRepsMin}–${config.targetRepsMax}`
                  : "—";

              const rest =
                config.restSeconds != null
                  ? `${Math.floor(config.restSeconds / 60)}:${String(
                      config.restSeconds % 60,
                    ).padStart(2, "0")}`
                  : "—";

              return (
                <Pressable
                  key={workoutExercise.id}
                  style={[
                    styles.exerciseRow,
                    { borderBottomColor: t.colors.border },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/workout/exercise",
                      params: { exerciseId: exercise.id },
                    })
                  }
                >
                  <View style={styles.exerciseColumn}>
                    <View
                      style={[
                        styles.exerciseThumbnail,
                        {
                          backgroundColor: t.colors.surface,
                          borderColor: t.colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name="barbell-outline"
                        size={24}
                        color={t.colors.textMuted}
                      />
                    </View>

                    <Text
                      style={[styles.exerciseName, { color: t.colors.text }]}
                      numberOfLines={2}
                    >
                      {exercise.title}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.setsColumn,
                      styles.cellText,
                      { color: t.colors.text },
                    ]}
                  >
                    {config.targetSets ?? "—"}
                  </Text>

                  <Text
                    style={[
                      styles.repsColumn,
                      styles.cellText,
                      { color: t.colors.text },
                    ]}
                  >
                    {reps}
                  </Text>

                  <Text
                    style={[
                      styles.restColumn,
                      styles.cellText,
                      { color: t.colors.text },
                    ]}
                  >
                    {rest}
                  </Text>

                  <Pressable
                    style={styles.menuColumn}
                    onPress={(event) => {
                      event.stopPropagation();
                      setSelectedExerciseId(workoutExercise.id);
                    }}
                  >
                    <Ionicons
                      name="ellipsis-vertical"
                      size={18}
                      color={t.colors.textMuted}
                    />
                  </Pressable>
                </Pressable>
              );
            })}
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
          </View>
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

      <Modal
        visible={editingExerciseId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingExerciseId(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.optionsMenu,
              {
                backgroundColor: t.colors.surface,
                borderColor: t.colors.border,
                padding: 20,
                gap: 16,
              },
            ]}
          >
            <Text
              style={{ color: t.colors.text, fontSize: 18, fontWeight: "700" }}
            >
              Edit configuration
            </Text>

            <Text style={{ color: t.colors.textMuted }}>
              Configuration form coming next.
            </Text>

            <Pressable onPress={() => setEditingExerciseId(null)}>
              <Text style={{ color: t.colors.primary }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  emptyText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 14,
  },
  exerciseTable: {
    marginTop: 12,
  },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  columnLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  exerciseColumn: {
    flex: 2.6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  setsColumn: {
    flex: 0.55,
    textAlign: "center",
  },

  repsColumn: {
    flex: 0.9,
    textAlign: "center",
  },

  restColumn: {
    flex: 0.8,
    textAlign: "center",
  },

  menuColumn: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseThumbnail: {
    width: 46,
    height: 46,
    borderWidth: 1,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseName: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
  },

  cellText: {
    fontSize: 13,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  optionsMenu: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
  },

});
