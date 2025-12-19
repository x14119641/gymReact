import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { DaysPerWeek } from "../../model/types";

const OPTIONS: { label: string; value: DaysPerWeek }[] = [
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5+", value: "5_plus" },
];

export default function DaysPerWeekStep({
  value,
  onChange,
}: {
  value: DaysPerWeek | null;
  onChange: (next: DaysPerWeek | null) => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[styles.box, active && styles.boxActive]}
            >
              <Text style={[styles.boxText, active && styles.boxTextActive]}>{opt.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>
        Tip: choose what you can do on your worst week.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  box: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
  },
  boxActive: { borderColor: "rgba(0,0,0,0.55)" },
  boxText: { fontSize: 18, fontWeight: "800" },
  boxTextActive: {},
  hint: { fontSize: 13, opacity: 0.7, lineHeight: 18 },
});
