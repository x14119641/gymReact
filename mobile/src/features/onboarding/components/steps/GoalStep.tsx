import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Goal } from "../../model/types";


const OPTIONS: { label: string; value: Goal; description: string }[] = [
  { label: "Get stronger", value: "strength", description: "Focus on usable strength and performance." },
  { label: "Rehabilitation", value: "rehabilitation", description: "Training smart avoiding/focusing in exercises, body parts and times." },
  { label: "Build muscle", value: "hypertrophy", description: "Increase muscle size and shape." },
  { label: "Lose fat", value: "fat_loss", description: "Improve body composition and conditioning." },
  { label: "Move better", value: "mobility", description: "Mobility, control, and joint health." },
  { label: "Sport performance", value: "performance", description: "Train for your sport and athleticism." },
  { label: "Not sure yet", value: "unsure", description: "We’ll guide you as you go." },
];


export default function GoalStep({
    value, onChange
}: {
    value: Goal | null;
    onChange: (next: Goal | null) => void; 
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
            <Text style={[styles.label, active && styles.labelActive]}>{opt.label}</Text>
            <Text style={[styles.desc, active && styles.descActive]}>{opt.description}</Text>
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
  cardActive: {
    borderColor: "rgba(0,0,0,0.55)",
  },
  label: { fontSize: 16, fontWeight: "700" },
  labelActive: {},
  desc: { marginTop: 6, fontSize: 13, opacity: 0.7, lineHeight: 18 },
  descActive: { opacity: 0.8 },
});