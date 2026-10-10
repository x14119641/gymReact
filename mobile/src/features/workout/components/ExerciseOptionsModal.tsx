import { View, StyleSheet, Text, Pressable, Modal } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

type ExerciseOptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onEditConfiguration: () => void;
  onRemove: () => void;
};

export function ExerciseOptionsModal({
  visible,
  onClose,
  onEditConfiguration,
  onRemove,
}: ExerciseOptionsModalProps) {
  const t = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.optionsMenu,
            {
              backgroundColor: t.colors.surface,
              borderColor: t.colors.border,
            },
          ]}
        >
          <Pressable style={styles.optionRow} onPress={onEditConfiguration}>
            <Ionicons name="create-outline" size={20} color={t.colors.text} />
            <Text style={{ color: t.colors.text }}>Edit configuration</Text>
          </Pressable>
          <Pressable style={styles.optionRow} disabled>
            <Ionicons
              name="copy-outline"
              size={20}
              color={t.colors.textMuted}
            />
            <Text style={{ color: t.colors.textMuted }}>
              Duplicate exercise (soon)
            </Text>
          </Pressable>

          <View style={{ height: 1, backgroundColor: t.colors.border }} />

          <Pressable style={styles.optionRow} onPress={onRemove}>
            <Ionicons name="trash-outline" size={20} color="#E35D5D" />
            <Text style={{ color: "#E35D5D" }}>Remove exercise</Text>
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
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
