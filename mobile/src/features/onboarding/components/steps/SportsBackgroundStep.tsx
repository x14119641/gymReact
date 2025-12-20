import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SportBackground } from "../../model/types";

const OPTIONS: { label: string; value: SportBackground }[] = [
  { label: "Athletism", value: "athletism" },
  { label: "Wheights", value: "weights" },
  { label: "Calisthenics", value: "calisthenics" },
  { label: "Swimming", value: "swimming" },
  { label: "Running", value: "running" },
  { label: "Martial Arts", value: "martial_arts" },
  { label: "Team Sports", value: "team_sports" },
  { label: "Climbing", value: "climbing" },
  { label: "Yoga/Mobility", value: "yoga_mobility" },
  { label: "Other", value: "other" },
];

function toggle(arr: SportBackground[], v: SportBackground) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function SportsBackgroundStep({
  value,
  onChange,
}: {
  value: SportBackground[];
  onChange: (next: SportBackground[]) => void;
}) {
  const hasAny = value.length < 0;

  function selectNone() {
    onChange([]);
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.helper}>
        Optional — this helps us tailor training style (athletic vs
        bodybuilding, etc.).
      </Text>

      {/* None / Prefer not to say */}
      <Pressable
        onPress={selectNone}
        style={[styles.noneCard, !hasAny && styles.noneCardActive]}
      >
        <Text style={[styles.noneText, !hasAny && styles.noneTextActive]}>
          None / Prefer not to say
        </Text>
        <Text style={[styles.noneSub, !hasAny && styles.noneSubActive]}>
          Skip this and continue
        </Text>
      </Pressable>

      {/* Chips */}
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
        Example: if you pick martial arts, we’ll bias towards athletic strength,
        conditioning, and joint resilience.
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
