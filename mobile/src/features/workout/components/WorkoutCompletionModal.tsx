import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import React, { useState } from "react";
import { WorkoutEffortType } from "@/src/types/workout";

const effortLabels: Record<WorkoutEffortType, string> = {
  1: "Very easy",
  2: "Easy",
  3: "Somewhat easy",
  4: "Moderate",
  5: "Somewhat hard",
  6: "Very hard",
  7: "Maximum effort",
};

type WorkoutCompletionModalProps = {
  visible: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
  onSave: (effort: WorkoutEffortType | null) => void;
  onSkip: () => void;
};

export function WorkoutCompletionModal({
  visible,
  notes,
  onNotesChange,
  onClose,
  onSave,
  onSkip,
}: WorkoutCompletionModalProps) {
  const t = useTheme();

  const effortColors: Record<WorkoutEffortType, string> = {
    1: t.colors.success,
    2: t.colors.success,
    3: t.colors.success,
    4: t.colors.primary,
    5: t.colors.warning,
    6: t.colors.warning,
    7: t.colors.danger,
  };

  const [workoutEffort, setWorkoutEffort] = useState<WorkoutEffortType | null>(
    null,
  );


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.completionModal,
            { backgroundColor: t.colors.surface },
          ]}
        >
          <Text style={[styles.modalTitle, { color: t.colors.text }]}>
            Complete Workout
          </Text>

          <Text style={{ color: t.colors.textMuted }}>
            How difficult was your workout?
          </Text>

          <View>
            <View style={styles.effortRow}>
              {([1, 2, 3, 4, 5, 6, 7] as const).map((effort) => {
                const selected = workoutEffort === effort;
                const effortColor = effortColors[effort];
                return (
                  <Pressable
                    key={effort}
                    onPress={() => setWorkoutEffort(effort)}
                    accessibilityRole="button"
                    accessibilityLabel={`${effort}: ${effortLabels[effort]}`}
                    accessibilityState={{ selected }}
                    style={[
                      styles.effortOption,
                      {
                        backgroundColor: selected
                          ? effortColor
                          : t.colors.surface,
                        borderColor: selected
                          ? effortColor
                          : t.colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? t.colors.onPrimary : t.colors.text,
                        fontWeight: "600",
                      }}
                    >
                      {effort}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.effortLabel, { color: t.colors.textMuted }]}>
              {workoutEffort === null
                ? "No rating selected"
                : `${workoutEffort} · ${effortLabels[workoutEffort]}`}
            </Text>
          </View>

          <Text style={{ color: t.colors.textMuted }}>
            Workout notes (optional)
          </Text>

          <TextInput
            multiline
            value={notes}
            onChangeText={onNotesChange}
            placeholder="Anything you'd like to remember?"
            placeholderTextColor={t.colors.textMuted}
            style={[
              styles.modalNotesInput,
              {
                color: t.colors.text,
                borderColor: t.colors.border,
              },
            ]}
          />

          <View style={styles.modalActions}>
            <Pressable onPress={onSkip} style={styles.modalAction}>
              <Text style={{ color: t.colors.textMuted }}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={() => onSave(workoutEffort)}
              style={[
                styles.modalAction,
                { backgroundColor: t.colors.primary, borderRadius: 8 },
              ]}
            >
              <Text style={{ color: t.colors.onPrimary, fontWeight: "700" }}>
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },

  completionModal: {
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  effortRow: {
    flexDirection: "row",
    gap: 4,
  },

  effortOption: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
  },

  effortLabel: {
    marginTop: 8,
    textAlign: "center",
  },

  modalNotesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },

  modalAction: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
