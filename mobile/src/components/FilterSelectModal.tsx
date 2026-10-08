import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
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
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filter"
        />
        <View style={[styles.sheet, { backgroundColor: t.colors.surface }]}>
          <Text style={[styles.title, { color: t.colors.text }]}>{title}</Text>

          <ScrollView
            style={styles.optionsList}
            contentContainerStyle={styles.optionsContent}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
          >
            <Pressable
              style={styles.option}
              onPress={() => {
                onSelect(null);
                onClose();
              }}
            >
              <Text
                style={{
                  color:
                    selectedValue === null ? t.colors.primary : t.colors.text,
                  fontWeight: selectedValue === null ? "700" : "400",
                }}
              >
                All
              </Text>

              {selectedValue === null && (
                <Text style={{ color: t.colors.primary }}>✓</Text>
              )}
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
                <Text
                  style={{
                    color:
                      selectedValue === option
                        ? t.colors.primary
                        : t.colors.text,
                    fontWeight: selectedValue === option ? "700" : "400",
                  }}
                >
                  {option}
                </Text>

                {selectedValue === option && (
                  <Text style={{ color: t.colors.primary }}>✓</Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
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
    maxHeight: "25%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
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
    paddingVertical: 12,
  },
  optionsList: {
    marginTop: 12,
  },
  optionsContent: {
    paddingRight: 16,
  },
});
