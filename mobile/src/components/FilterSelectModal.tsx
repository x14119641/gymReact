import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type FilterSelectModalProps = {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
  onClose: () => void;
};

export function FilterSelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterSelectModalProps) {
  const t = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: t.colors.surface }]}>
          <Text style={[styles.title, { color: t.colors.text }]}>{title}</Text>
          <Pressable
            style={styles.option}
            onPress={() => {
              onSelect(null);
              onClose();
            }}
          >
            <Text style={{ color: t.colors.text }}>All</Text>
          </Pressable>

          {options.map((option) => (
            <Pressable
              key={option}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={{ color: t.colors.text }}>{option}</Text>

              {selectedValue === option && (
                <Text style={{ color: t.colors.primary }}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  option: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 14,
},
});
