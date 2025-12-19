import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { EquipmentAccess } from "../../model/types";

const OPTIONS: { label: string; value: EquipmentAccess; desc: string }[] = [
  { label: "Gym", value: "gym", desc: "Full gym access." },
  { label: "Home gym", value: "home_gym", desc: "Some equipment at home." },
  { label: "Bodyweight", value: "bodyweight", desc: "Minimal equipment." },
  { label: "Mixed", value: "mixed", desc: "Sometimes gym, sometimes home." },
];

function toggle(arr: EquipmentAccess[], v: EquipmentAccess) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export default function EquipmentStep({
  value,
  onChange,
}: {
  value: EquipmentAccess[];
  onChange: (next: EquipmentAccess[]) => void;
}) {
  return (
    <View style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(toggle(value, opt.value))}
            style={[styles.card, active && styles.cardActive]}
          >
            <View style={styles.row}>
              <Text style={[styles.label, active && styles.labelActive]}>
                {opt.label}
              </Text>
              <Text style={[styles.badge, active && styles.badgeActive]}>
                {active ? "Selected" : ""}
              </Text>
            </View>
            <Text style={[styles.desc, active && styles.descActive]}>
              {opt.desc}
            </Text>
          </Pressable>
        );
      })}
      <Text style={styles.hint}>Select all that apply.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  badge: { fontSize: 12, opacity: 0.5 },
  badgeActive: { opacity: 0.9 },
  hint: { marginTop: 6, fontSize: 12, opacity: 0.65 },
});
