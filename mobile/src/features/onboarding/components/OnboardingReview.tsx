import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { OnboardingAnswers } from "../model/types";

function prettyLabel(key: keyof OnboardingAnswers) {
  switch (key) {
    case "goal":
      return "Goal";
    case "days_per_week":
      return "Days / week";
    case "experience_level":
      return "Experience";
    case "equipment_access":
      return "Equipment";
    case "injuries":
      return "Injuries";
    case "sports_background":
      return "Sports";
    case "session_length":
      return "Session length";
    default:
      return key;
  }
}


function prettyValue(v:unknown) {
    if (v===null) return "-";
    if (Array.isArray(v)) return v.length ? v.join(", ") :"-";
    return String(v)
}


export default function OnboardingReview({answers} : {answers: OnboardingAnswers}) {
    const keys = Object.keys(answers) as (keyof OnboardingAnswers)[];

    return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.subtitle}>
        You can change this anytime later in your profile.
      </Text>

      <View style={styles.card}>
        {keys.map((k) => (
          <View key={k} style={styles.row}>
            <Text style={styles.left}>{prettyLabel(k)}</Text>
            <Text style={styles.right}>{prettyValue(answers[k])}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 13, opacity: 0.7, lineHeight: 18 },
  card: {
    marginTop: 6,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
    gap: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  left: { fontSize: 14, fontWeight: "700", opacity: 0.75 },
  right: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right" },
});