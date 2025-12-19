import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { InjuryArea } from "../../model/types";

const OPTIONS: { label: string; value: InjuryArea }[] = [
  { label: "Shoulder", value: "shoulder" },
  { label: "Elbow", value: "elbow" },
  { label: "Wrist / hand", value: "wrist_hand" },
  { label: "Neck", value: "neck" },
  { label: "Back", value: "back" },
  { label: "Hip", value: "hip" },
  { label: "Knee", value: "knee" },
  { label: "Ankle", value: "ankle" },
];

function toggle(arr: InjuryArea[], v: InjuryArea) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function InjuriesStep({
  value,
  onChange,
}: {
  value: InjuryArea[];               // never null (defaults to [])
  onChange: (next: InjuryArea[]) => void;
}) {
  const hasAny = value.length > 0;

  function selectNone() {
    // "None" means empty array
    onChange([]);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.helper}>
        Select anything that needs extra caution. You can update this anytime.
      </Text>

      {/* None button */}
      <Pressable
        onPress={selectNone}
        style={[styles.noneCard, !hasAny && styles.noneCardActive]}
      >
        <Text style={[styles.noneText, !hasAny && styles.noneTextActive]}>
          None
        </Text>
        <Text style={[styles.noneSub, !hasAny && styles.noneSubActive]}>
          No current injuries or limitations
        </Text>
      </Pressable>

      <View style={styles.grid}>
        {OPTIONS.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(toggle(value, opt.value))}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.note}>
        We’ll use this to avoid risky exercises and suggest safer alternatives.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },

  helper: { fontSize: 13, opacity: 0.7, lineHeight: 18 },

  noneCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
  },
  noneCardActive: { borderColor: "rgba(0,0,0,0.55)" },
  noneText: { fontSize: 16, fontWeight: "800" },
  noneTextActive: {},
  noneSub: { marginTop: 6, fontSize: 13, opacity: 0.7, lineHeight: 18 },
  noneSubActive: { opacity: 0.8 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
  },
  pillActive: { borderColor: "rgba(0,0,0,0.55)" },
  pillText: { fontSize: 14, fontWeight: "600" },
  pillTextActive: {},
  note: { fontSize: 12, opacity: 0.65, lineHeight: 16 },
});
