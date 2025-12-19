// src/features/onboarding/components/OnboardingStepLayout.tsx

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  stepNumber: number; // 1-based
  totalSteps: number;
  title: string;
  subtitle?: string;

  primaryLabel: string; // "Next" / "Finish"
  canGoNext: boolean;

  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void; // undefined => hide skip

  children: React.ReactNode;
};

export default function OnboardingStepLayout({
  stepNumber,
  totalSteps,
  title,
  subtitle,
  primaryLabel,
  canGoNext,
  onBack,
  onNext,
  onSkip,
  children,
}: Props) {
  const progress = totalSteps > 0 ? stepNumber / totalSteps : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Back</Text>
        </Pressable>

        <Text style={styles.progressText}>
          {stepNumber} of {totalSteps}
        </Text>

        {/* spacer to balance layout */}
        <View style={styles.headerBtn} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>

      {/* Footer */}
      <View style={styles.footer}>
        {!!onSkip && (
          <Pressable onPress={onSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onNext}
          disabled={!canGoNext}
          style={[styles.primaryBtn, !canGoNext && styles.primaryBtnDisabled]}
        >
          <Text style={styles.primaryText}>{primaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerBtn: { width: 60, paddingVertical: 8 },
  headerBtnText: { fontSize: 16 },
  progressText: { fontSize: 14, opacity: 0.7 },

  progressTrack: { height: 6, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.08)", marginTop: 12 },
  progressFill: { height: 6, borderRadius: 6, backgroundColor: "rgba(0,0,0,0.35)" },

  titleBlock: { marginTop: 18, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 14, opacity: 0.7, lineHeight: 20 },

  content: { flex: 1, marginTop: 18 },

  footer: { gap: 12 },
  skipBtn: { paddingVertical: 10, alignItems: "center" },
  skipText: { fontSize: 14, opacity: 0.7 },

  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "black",
  },
  primaryBtnDisabled: { opacity: 0.35 },
  primaryText: { color: "white", fontWeight: "700", fontSize: 16 },
});
