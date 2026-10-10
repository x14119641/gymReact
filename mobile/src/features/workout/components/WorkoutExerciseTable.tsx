import { View, StyleSheet, Text, Pressable } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { WorkoutExercise } from "@/src/types/workout";
import { exercises } from "@/src/mocks/exercises.mock";

type WorkoutExerciseTableProps = {
  workoutExercises: WorkoutExercise[];
  onOpenOptions: (workoutExerciseId: string) => void;
  onNavigate: (workoutExerciseId: string) => void;
  onAdd: () => void;
};

export function WorkoutExerciseTable({
  workoutExercises,
  onOpenOptions,
  onNavigate,
  onAdd,
}: WorkoutExerciseTableProps) {
  const t = useTheme();
  const isExerciseListEmpty = workoutExercises.length === 0;

  return (
    <View style={styles.exerciseTable}>
      {!isExerciseListEmpty && (
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
            style={[styles.exerciseRow, { borderBottomColor: t.colors.border }]}
            onPress={() => onNavigate(workoutExercise.id)}
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
                onOpenOptions(workoutExercise.id);
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
        onPress={onAdd}
      >
        <Ionicons name="add-outline" size={20} color={t.colors.primary} />
        <Text style={[styles.addText, { color: t.colors.primary }]}>
          Add Exercise
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
