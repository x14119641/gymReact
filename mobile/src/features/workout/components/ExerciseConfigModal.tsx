import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";

type ExerciseConfigModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ExerciseConfigModal({
  visible,
  onClose,
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

          <Text style={{ color: t.colors.textMuted }}>
            Configuration form coming next.
          </Text>

          <Pressable onPress={onClose}>
            <Text style={{ color: t.colors.primary }}>Cancel</Text>
          </Pressable>
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
});
