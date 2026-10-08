import { Text, View, StyleSheet, Pressable } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { exercises } from "@/src/mocks/exercises.mock";
import { useState } from "react";

const mockSets = [
  { id: 1, lastReps: "12", lastWeight: "10" },
  { id: 2, lastReps: "10", lastWeight: "10" },
  { id: 3, lastReps: "8", lastWeight: "10" },
];

export default function ExerciseScreen() {
  const t = useTheme();
  const router = useRouter();

  const { exerciseId } = useLocalSearchParams<{ exerciseId?: string }>();
  const exercise = exercises.find((item) => item.id === exerciseId);

  const [activeTab, setActiveTab] = useState<"exercise" | "overview">(
    "exercise",
  );

  if (!exercise) {
    return (
      <BaseLayout>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={t.colors.textMuted}
          />

          <Text style={{ color: t.colors.text }}>Exercise not found</Text>

          <Pressable onPress={() => router.back()}>
            <Text style={{ color: t.colors.primary }}>Go back</Text>
          </Pressable>
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={t.colors.primary} />
      </Pressable>
      <Text style={[styles.title, { color: t.colors.text }]}>
        {exercise.title}
      </Text>

      <View style={styles.headerDetails}>
        {activeTab === "exercise" && (
          <View style={styles.configurationContent}>
            <View style={styles.configurationHeader}>
              <Text
                style={[styles.sectionLabel, { color: t.colors.textMuted }]}
              >
                WORKOUT CONFIGURATION
              </Text>

              <Ionicons
                name="options-outline"
                size={20}
                color={t.colors.textMuted}
              />
            </View>

            <View style={styles.configurationRow}>
              <View style={styles.configurationItem}>
                <Text
                  style={[styles.configLabel, { color: t.colors.textMuted }]}
                >
                  SETS
                </Text>
                <Text style={[styles.configValue, { color: t.colors.text }]}>
                  03
                </Text>
              </View>

              <View style={styles.configurationItem}>
                <Text
                  style={[styles.configLabel, { color: t.colors.textMuted }]}
                >
                  REP RANGE
                </Text>
                <Text style={[styles.configValue, { color: t.colors.text }]}>
                  10–12
                </Text>
              </View>

              <View style={styles.configurationItem}>
                <Text
                  style={[styles.configLabel, { color: t.colors.textMuted }]}
                >
                  REST
                </Text>
                <Text style={[styles.configValue, { color: t.colors.text }]}>
                  2:00
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "overview" && (
          <View style={styles.overviewHeader}>
            <View style={styles.exerciseMetadata}>
              <View
                style={[
                  styles.metadataChip,
                  { backgroundColor: t.colors.surface },
                ]}
              >
                <Ionicons
                  name="body-outline"
                  size={15}
                  color={t.colors.primary}
                />
                <Text style={{ color: t.colors.text }}>{exercise.muscle}</Text>
              </View>

              <View
                style={[
                  styles.metadataChip,
                  { backgroundColor: t.colors.surface },
                ]}
              >
                <Ionicons
                  name="barbell-outline"
                  size={15}
                  color={t.colors.primary}
                />
                <Text style={{ color: t.colors.text }}>
                  {exercise.equipment}
                </Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <Text style={[styles.ratingLabel, { color: t.colors.textMuted }]}>
                MY RATING
              </Text>

              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star-outline"
                    size={20}
                    color={t.colors.primary}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.tabBar}>
        {(["exercise", "overview"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                borderBottomColor:
                  activeTab === tab ? t.colors.primary : t.colors.border,
                borderBottomWidth: activeTab === tab ? 3 : 1,
              },
            ]}
          >
            <Text
              style={{
                color:
                  activeTab === tab ? t.colors.primary : t.colors.textMuted,
                fontWeight: activeTab === tab ? "700" : "500",
              }}
            >
              {tab === "exercise" ? "Exercise" : "Overview"}
            </Text>
          </Pressable>
        ))}
      </View>
      {activeTab === "exercise" && (
        <View style={styles.table}>
          {/* Set table headings */}
          <View style={styles.setRow}>
            <Text
              style={[
                styles.setColumn,
                styles.columnLabel,
                { color: t.colors.textMuted },
              ]}
            >
              SET
            </Text>
            <Text
              style={[
                styles.inputColumn,
                styles.columnLabel,
                { color: t.colors.textMuted },
              ]}
            >
              REPS
            </Text>
            <Text
              style={[
                styles.inputColumn,
                styles.columnLabel,
                { color: t.colors.textMuted },
              ]}
            >
              WEIGHT (KG)
            </Text>
          </View>

          {/* Mock sets */}
          {mockSets.map((set, index) => (
            <View key={set.id}>
              <View style={styles.setRow}>
                <View style={styles.setColumn}>
                  <View
                    style={[
                      styles.setBadge,
                      { backgroundColor: t.colors.surface },
                    ]}
                  >
                    <Text
                      style={[styles.setBadgeText, { color: t.colors.primary }]}
                    >
                      {String(set.id).padStart(2, "0")}
                    </Text>
                  </View>
                </View>

                <View style={styles.inputColumn}>
                  <View
                    style={[
                      styles.inputPlaceholder,
                      {
                        backgroundColor: t.colors.surface,
                        borderColor: t.colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: t.colors.textMuted }}>10–12</Text>
                  </View>

                  <Text
                    style={[styles.lastTime, { color: t.colors.textMuted }]}
                  >
                    Last: {set.lastReps}
                  </Text>
                </View>

                <View style={styles.inputColumn}>
                  <View
                    style={[
                      styles.inputPlaceholder,
                      {
                        backgroundColor: t.colors.surface,
                        borderColor: t.colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: t.colors.textMuted }}>—</Text>
                  </View>

                  <Text
                    style={[styles.lastTime, { color: t.colors.textMuted }]}
                  >
                    Last: {set.lastWeight} kg
                  </Text>
                </View>
              </View>

              {index < mockSets.length - 1 && (
                <View
                  style={[
                    styles.setDivider,
                    { backgroundColor: t.colors.border },
                  ]}
                />
              )}
            </View>
          ))}

          <View
            style={[styles.addSetPlaceholder, { borderColor: t.colors.border }]}
          >
            <Ionicons name="add-outline" size={20} color={t.colors.primary} />
            <Text style={{ color: t.colors.primary, fontWeight: "600" }}>
              Add set
            </Text>
          </View>
        </View>
      )}
      {activeTab === "overview" && (
        <View style={styles.overviewContent}>
          {/* Media placeholder */}
          <View
            style={[
              styles.mediaPlaceholder,
              {
                backgroundColor: t.colors.surface,
                borderColor: t.colors.border,
              },
            ]}
          >
            <Ionicons
              name="play-circle-outline"
              size={44}
              color={t.colors.textMuted}
            />

            <Text style={{ color: t.colors.text }}>Exercise demonstration</Text>

            <Text style={[styles.mediaHint, { color: t.colors.textMuted }]}>
              Video coming later
            </Text>
          </View>
          <View style={styles.overviewSection}>
            <Text style={[styles.overviewHeading, { color: t.colors.text }]}>
              Muscles worked
            </Text>

            <View
              style={[
                styles.musclePlaceholder,
                {
                  backgroundColor: t.colors.surface,
                  borderColor: t.colors.border,
                },
              ]}
            >
              <View style={styles.muscleView}>
                <Ionicons
                  name="body-outline"
                  size={42}
                  color={t.colors.textMuted}
                />
                <Text style={{ color: t.colors.textMuted }}>Front view</Text>
              </View>

              <View style={styles.muscleView}>
                <Ionicons
                  name="body-outline"
                  size={42}
                  color={t.colors.textMuted}
                />
                <Text style={{ color: t.colors.textMuted }}>Back view</Text>
              </View>
            </View>
          </View>

          {/* Instructions placeholder */}
          <View style={styles.overviewSection}>
            <Text style={[styles.overviewHeading, { color: t.colors.text }]}>
              Instructions
            </Text>

            <Text style={{ color: t.colors.textMuted, lineHeight: 22 }}>
              Exercise instructions will be available here.
            </Text>
          </View>
        </View>
      )}
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    padding: 6,
  },
  pressed: { opacity: 0.75 },
  headerDetails: {
    height: 100,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  tabBar: {
    flexDirection: "row",
    marginTop: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  table: {
    marginTop: 20,
    gap: 12,
  },
  configurationContent: {
    marginTop: 4,
    gap: 6,
  },
  configurationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
  configurationRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  configurationItem: {
    flex: 1,
    gap: 5,
  },
  configLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  configValue: {
    fontSize: 22,
    fontWeight: "700",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 9,
  },
  setColumn: {
    width: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  inputColumn: {
    flex: 1,
    alignItems: "center",
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  setBadge: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  setBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  inputPlaceholder: {
    width: "100%",
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  lastTime: {
    fontSize: 11,
    marginTop: 6,
  },
  setDivider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64,
  },
  addSetPlaceholder: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 13,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    marginTop: 16,
  },
  overviewContent: {
    marginTop: 20,
    gap: 28,
  },
  mediaPlaceholder: {
    height: 190,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mediaHint: {
    fontSize: 12,
  },
  overviewSection: {
    gap: 14,
  },
  overviewHeading: {
    fontSize: 17,
    fontWeight: "700",
  },
  musclePlaceholder: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 28,
  },
  muscleView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  exerciseMetadata: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  metadataChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  overviewHeader: {
    gap: 14,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ratingLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },

  stars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
