import { useTheme } from "@/src/theme/ThemeProvider";
import { View, StyleSheet, Text, Pressable, TextInput } from "react-native";

type ExerciseConfigNumbersProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: number;
  step?: number;
  min?: number;
};

export function ExerciseConfigNumbers({
  label,
  value,
  onChange,
  placeholder = "0",
  defaultValue = 0,
  step = 1,
  min = 0,
}: ExerciseConfigNumbersProps) {
  const t = useTheme();

  const changeBy = (direction: -1 | 1) => {
    const parsed = value.trim() === "" ? defaultValue : Number(value);
    const current = Number.isFinite(parsed) ? parsed : defaultValue;

    onChange(String(Math.max(min, current + direction * step)));
  };

  return (
    <View style={styles.field}>
      <Text style={{ color: t.colors.text }}>{label}</Text>

      <View style={styles.numberControl}>
        <Pressable
          style={[
            styles.stepButton,
            {
              borderColor: t.colors.border,
              backgroundColor: t.colors.background,
            },
          ]}
          onPress={() => changeBy(-1)}
        >
          <Text style={{ color: t.colors.primary }}>−</Text>
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="number-pad"
          placeholder={placeholder}
          placeholderTextColor={t.colors.textMuted}
          style={[
            styles.numberInput,
            {
              color: t.colors.text,
              borderColor: t.colors.border,
            },
          ]}
        />

        <Pressable
          style={[
            styles.stepButton,
            {
              borderColor: t.colors.border,
              backgroundColor: t.colors.background,
            },
          ]}
          onPress={() => changeBy(1)}
        >
          <Text style={{ color: t.colors.primary }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },

  numberControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  numberInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 16,
  },
  stepButton: {
    width: 36,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
