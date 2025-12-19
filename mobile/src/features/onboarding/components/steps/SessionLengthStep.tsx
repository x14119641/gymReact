import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { SessionLength } from "../../model/types";

const OPTIONS: { label: string; value: SessionLength; desc: string }[] = [
  { label: "30 min", value: "30", desc: "Quick, focused sessions." },
  { label: "45 min", value: "45", desc: "Efficient and balanced." },
  { label: "60 min", value: "60", desc: "Standard full workout." },
  { label: "90+ min", value: "90_plus", desc: "Long sessions with more volume." },
];

export default function SessionLengthStep({
  value,
  onChange,
}: {
  value: SessionLength | null;
  onChange: (next: SessionLength | null) => void;
}) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.card, active && styles.cardActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {opt.label}
            </Text>
            <Text style={[styles.desc, active && styles.descActive]}>
              {opt.desc}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
  },
  cardActive: { borderColor: "rgba(0,0,0,0.55)" },
  label: { fontSize: 16, fontWeight: "700" },
  labelActive: {},
  desc: { marginTop: 6, fontSize: 13, opacity: 0.7, lineHeight: 18 },
  descActive: { opacity: 0.8 },
});
