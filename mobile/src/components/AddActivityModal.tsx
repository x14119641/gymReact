import { Modal, Pressable, View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  visible: boolean;
  onClose: () => void;
};
export function AddActivityModal({ visible, onClose }: Props) {
  const t = useTheme();
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: t.colors.surface }]}
          onPress={() => {}}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.header, { color: t.colors.text }]}>
              Add Work Session
            </Text>
            <Text style={[styles.date, { color: t.colors.textMuted }]}>
              {formattedDate}
            </Text>
          </View>
          {/* Wee add a "view/contaner" to add "gap" spaces between the "buttons" */}
          <View style={styles.options}>
            {/* Freestyle workout */}
            <Pressable
              style={[
                styles.optionRow,
                {
                  borderColor: t.colors.border,
                  // backgroundColor: t.colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={t.colors.text}
              />

              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: t.colors.text }]}>
                  Freestyle workout
                </Text>

                <Text
                  style={[
                    styles.optionDescription,
                    { color: t.colors.textMuted },
                  ]}
                >
                  Start an empty workout
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={t.colors.textMuted}
              />
            </Pressable>

            {/* Saved workout */}
            <Pressable
              style={[
                styles.optionRow,
                {
                  borderColor: t.colors.border,
                  // backgroundColor: t.colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="barbell-outline"
                size={24}
                color={t.colors.text}
              />

              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: t.colors.text }]}>
                  Saved Routines
                </Text>

                <Text
                  style={[
                    styles.optionDescription,
                    { color: t.colors.textMuted },
                  ]}
                >
                  Start from a saved routine
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={t.colors.textMuted}
              />
            </Pressable>

            {/* Measurements */}
            <Pressable
              style={[
                styles.optionRow,
                {
                  borderColor: t.colors.border,
                  // backgroundColor: t.colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="accessibility-outline"
                size={24}
                color={t.colors.text}
              />

              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: t.colors.text }]}>
                  Measurements
                </Text>

                <Text
                  style={[
                    styles.optionDescription,
                    { color: t.colors.textMuted },
                  ]}
                >
                  Record new body measurements
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={t.colors.textMuted}
              />
            </Pressable>

            {/* Cardio */}
            <Pressable
              style={[
                styles.optionRow,
                {
                  borderColor: t.colors.border,
                  // backgroundColor: t.colors.surfaceSecondary,
                },
              ]}
            >
              <Ionicons
                name="fitness-outline"
                size={24}
                color={t.colors.text}
              />

              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: t.colors.text }]}>
                  Cardio
                </Text>

                <Text
                  style={[
                    styles.optionDescription,
                    { color: t.colors.textMuted },
                  ]}
                >
                  Record a cardio activity
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={t.colors.textMuted}
              />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheet: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  headerRow: {
    marginBottom: 10,
    gap: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    // textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  optionDescription: {
    fontSize: 13,
    marginTop: 3,
  },

  options: {
    gap: 10,
  },
  
  date: {
    fontSize: 13,
  },
});
