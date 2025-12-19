import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ExperienceLevel } from "../../model/types";


const OPTIONS: { label: string; value: ExperienceLevel; desc: string }[] = [
  { label: "Beginner", value: "beginner", desc: "0–6 months or starting fresh." },
  { label: "Intermediate", value: "intermediate", desc: "Training consistently for months." },
  { label: "Advanced", value: "advanced", desc: "Years of training, good technique." },
  { label: "Returning", value: "returning", desc: "You trained before, coming back now." },
];


export default function ExperienceStep({
    value, onChange
}: {
    value: ExperienceLevel | null;
    onChange: (next:ExperienceLevel | null) => void;
}) {
    return (
        <View style={styles.wrap}>
            {OPTIONS.map((opt) => {
                const active = value === opt.value;
                return (
                    <Pressable
                    key={opt.value}
                    onPress={()=> onChange(opt.value)}
                    style={[styles.card, active && styles.cardActive]}
                    >
                        <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
                        <Text style={[styles.desc, active && styles.descActive]}>{opt.desc}</Text>
                    </Pressable>
                )
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