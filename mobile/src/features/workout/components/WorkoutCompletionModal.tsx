import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useState } from "react";


export type WorkoutEffort = "easy" | "moderate" | "hard" | "maximum";

type WorkoutCompletionModalProps = {
  visible: boolean;
  notes: string;
  onNotesChange: (notes: string) => void;
  onClose: () => void;
  onSave: (effort: WorkoutEffort | null) => void;
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

  const [workoutEffort, setWorkoutEffort] =
    useState<WorkoutEffort | null>(null);

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

          {(["easy", "moderate", "hard", "maximum"] as const).map((effort) => (
            <Pressable
              key={effort}
              onPress={() => setWorkoutEffort(effort)}
              style={[
                styles.effortOption,
                {
                  borderColor:
                    workoutEffort === effort
                      ? t.colors.primary
                      : t.colors.border,
                },
              ]}
            >
              <Text style={{ color: t.colors.text }}>
                {effort === "easy"
                  ? "Easy"
                  : effort === "moderate"
                    ? "Moderate"
                    : effort === "hard"
                      ? "Hard"
                      : "Maximum effort"}
              </Text>

              {workoutEffort === effort && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={t.colors.primary}
                />
              )}
            </Pressable>
          ))}

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
            <Pressable
              onPress={onSkip}
              style={styles.modalAction}
            >
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

  effortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
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
