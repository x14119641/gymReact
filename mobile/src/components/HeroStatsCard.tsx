// src/components/HeroStatsCard.tsx
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Container } from "@/src/components/Container";

type FatigueLevel = "green" | "yellow" | "red";

type Props = {
  username?: string;
  strengthScore: number;

  streakDays?: number;
  sessionsThisWeek?: number;

  fatigueLevel: FatigueLevel;
  coachNote: string;
};

export default function HeroStatsCard({
  username,
  strengthScore,
  streakDays,
  sessionsThisWeek,
  fatigueLevel,
  coachNote,
}: Props) {
  const t = useTheme();

  const fatigueColor =
    fatigueLevel === "green"
      ? t.colors.success
      : fatigueLevel === "yellow"
      ? t.colors.warning
      : t.colors.error;

  // const fatigueLabel =
  //   fatigueLevel === "green" ? "GREEN" : fatigueLevel === "yellow" ? "YELLOW" : "RED";

  const momentumLine =
    typeof streakDays === "number"
      ? `🔥 ${streakDays} days in a row`
      : typeof sessionsThisWeek === "number"
      ? `🔥 ${sessionsThisWeek} sessions this week`
      : "🔥 —";

  return (
    <Container variant="default" density="compact" style={{marginHorizontal:12, marginTop:12}}>

        {/* Header */}
        <View style={s.headerRow}>
          <Text style={[s.header, { color: t.colors.text }]} numberOfLines={1}>
            User: {username ? username.toUpperCase() : "-"}
          </Text>

          <View style={s.fatigue}>
            <Text style={[s.headerChipText, { color: t.colors.text }]}>Fatigue</Text>
            <View style={[s.dot, { backgroundColor: fatigueColor }]} />
          </View>
        </View>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={{ flex: 1, marginRight:12 }}>
            <Text style={[s.label, { color: t.colors.subtext }]}>STRENGTH</Text>
            <Text style={[s.bigText, { color: t.colors.text }]}>{strengthScore}</Text>
          </View>

          {/* Vertical separator bar */}
          <View style={[s.vRule, { backgroundColor: t.colors.border }]} />

          <View style={{ flex: 1, marginLeft:12 }}>
            <Text style={[s.label, { color: t.colors.subtext }]}>MOMENTUM</Text>
            <Text style={[s.midText, { color: t.colors.text }]}>{momentumLine}</Text>
          </View>
        </View>

        {/* Horizontal separator bar */}
        <View style={[s.hRule, { backgroundColor: t.colors.border }]} />

        {/* Coach note */}
        <Text style={[s.label, { color: t.colors.subtext }]}>COACH NOTE</Text>
        <Text style={[s.note, { color: t.colors.text }]} numberOfLines={2}>
          {coachNote}
        </Text>
    </Container>
  );
}

const s = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  header: {
    flex:1,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginRight:12,
  },
  fatigue:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-end",
    flexShrink:0,
  },
  headerChipText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4,
    marginRight:8,
  },

  dot: { width: 10, height: 10, borderRadius: 99 },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  vRule: { width: 1, height: 44, opacity: 0.9 },

  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  bigText: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  midText: {
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },

  hRule: { width:"100%", height: 1, opacity: 0.9, marginVertical: 12 },

  note: {
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
});
