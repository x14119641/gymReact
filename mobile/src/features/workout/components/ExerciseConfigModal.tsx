import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { ExerciseConfigNumbers } from "./ExerciseConfigNumbers";

type ExerciseConfigModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;

  targetSets: string;
  onTargetSetsChange: (value: string) => void;

  minReps: string;
  onMinRepsChange: (value: string) => void;

  maxReps: string;
  onMaxRepsChange: (value: string) => void;

  restSeconds: string;
  onRestSecondsChange: (value: string) => void;
};

export function ExerciseConfigModal({
  visible,
  onClose,
  onSave,
  targetSets,
  onTargetSetsChange,
  minReps,
  onMinRepsChange,
  maxReps,
  onMaxRepsChange,
  restSeconds,
  onRestSecondsChange,
}: ExerciseConfigModalProps) {
  const t = useTheme();

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

          {/* Sets */}

          <ExerciseConfigNumbers
            label="Target Sets"
            value={targetSets}
            onChange={onTargetSetsChange}
            placeholder="3"
            defaultValue={3}
            min={1}
          />

          <View
            style={[
              styles.sectionDivider,
              { backgroundColor: t.colors.border },
            ]}
          />

          <Text style={{ color: t.colors.text }}>Target repetitions</Text>

          <View style={styles.repsRow}>
            <View style={styles.repField}>
              <ExerciseConfigNumbers
                label="Minimum"
                value={minReps}
                onChange={onMinRepsChange}
                placeholder="8"
                defaultValue={8}
                min={1}
              />
            </View>

            <View style={styles.repField}>
              <ExerciseConfigNumbers
                label="Maximum"
                value={maxReps}
                onChange={onMaxRepsChange}
                placeholder="12"
                defaultValue={12}
                min={1}
              />
            </View>
          </View>

          <View
            style={[
              styles.sectionDivider,
              { backgroundColor: t.colors.border },
            ]}
          />

          <ExerciseConfigNumbers
            label="Rest between sets (seconds)"
            value={restSeconds}
            onChange={onRestSecondsChange}
            placeholder="120"
            defaultValue={120}
            step={10}
            min={0}
          />

          <View style={styles.footer}>
            <Pressable style={styles.footerButton} onPress={onClose}>
              <Text style={{ color: t.colors.textMuted }}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.footerButton,
                { backgroundColor: t.colors.primary },
              ]}
              onPress={onSave}
            >
              <Text style={{ color: t.colors.onPrimary, fontWeight: "700" }}>
                Save
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  optionsMenu: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
  },
  repsRow: {
    flexDirection: "row",
    gap: 12,
  },

  repField: {
    flex: 1,
    minWidth: 0,
  },
  sectionDivider: {
    height: StyleSheet.hairlineWidth,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
