import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  isSameMonth,
} from "date-fns";
import { Container } from "@/src/components/Container";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useDateStore } from "@/src/store/dateStore";

// MOCK DATA !!
type Session = { id: string; title: string; time?: string };
const MOCK_SESSIONS: Record<string, Session[]> = {
  "2026-01-03": [{ id: "s1", title: "Push", time: "18:10" }],
  "2026-01-06": [
    { id: "s2", title: "Legs", time: "10:00" },
    { id: "s3", title: "Mobility", time: "19:30" },
  ],
  "2026-01-12": [{ id: "s4", title: "Pull" }],
  "2026-01-28": [{ id: "s5", title: "Legs" }],
};

function buildMonthGrid(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });

  const days: Date[] = [];
  let cur = start;
  while (cur <= end) {
    days.push(cur);
    cur = addDays(cur, 1);
  }
  return days;
}

export default function CalendarModal() {
  const t = useTheme();
  const router = useRouter();

  //   Hone date
  const homeDateISO = useDateStore((s) => s.homeDateISO);

  const [browseISO, setBrowseISO] = React.useState(homeDateISO);
  const browseDate = React.useMemo(() => new Date(browseISO), [browseISO]);

  const [month, setMonth] = React.useState(() => startOfMonth(browseDate));

  React.useEffect(() => {
    // keep month header aligned with the browsed date
    setMonth(startOfMonth(browseDate));
  }, [browseISO]);

  const days = React.useMemo(() => buildMonthGrid(month), [month]);
  const trainedSet = React.useMemo(
    () => new Set(Object.keys(MOCK_SESSIONS)),
    [],
  );
  const sessions = MOCK_SESSIONS[browseISO] ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: t.colors.bg }]}>
      <Container
        variant="default"
        density="compact"
        style={{ marginHorizontal: 12, marginTop: 12 }}
      >
        {/* Header */}
        <View
          style={[
            styles.headerPill,
            {
              borderColor: t.colors.console.border,
              backgroundColor: t.colors.console.chipBg,
            },
          ]}
        >
          <Pressable
            onPress={() => setMonth((m) => addMonths(m, -1))}
            hitSlop={12}
            style={({ pressed }) => [
              styles.arrowBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons name="chevron-back" size={18} color={t.colors.text} />
          </Pressable>
          <View
            style={[
              styles.pillDivider,
              { backgroundColor: t.colors.console.border },
            ]}
          />

          <Text
            style={[styles.headerTitle, { color: t.colors.text }]}
            numberOfLines={1}
          >
            {format(month, "MMMM yyyy")}
          </Text>
          <View
            style={[
              styles.pillDivider,
              { backgroundColor: t.colors.console.border },
            ]}
          />

          <Pressable
            onPress={() => setMonth((m) => addMonths(m, 1))}
            hitSlop={12}
            style={({ pressed }) => [
              styles.arrowBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons name="chevron-forward" size={18} color={t.colors.text} />
          </Pressable>
        </View>

        {/* Day names */}
        <View style={styles.dowRow}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <Text key={d} style={[styles.dow, { color: t.colors.subtext }]}>
              {d}
            </Text>
          ))}
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {days.map((d) => {
            const iso = format(d, "yyyy-MM-dd");
            const isMonth = isSameMonth(d, month);
            const isActive = iso === browseISO;
            const hasTraining = trainedSet.has(iso);

            return (
              <Pressable
                key={iso}
                onPress={() => setBrowseISO(iso)}
                style={[
                  styles.cell,
                  {
                    borderColor: isActive
                      ? t.colors.accent
                      : t.colors.console.border,
                    backgroundColor: isActive
                      ? t.colors.console.chipBg
                      : "transparent",
                    opacity: isMonth ? 1 : 0.35,
                  },
                ]}
                hitSlop={6}
              >
                <Text style={[styles.dayNum, { color: t.colors.text }]}>
                  {format(d, "d")}
                </Text>

                {hasTraining && (
                  <View
                    style={[
                      styles.dotBottom,
                      {
                        backgroundColor: t.colors.accent,
                        borderColor: isActive
                          ? t.colors.console.chipBg
                          : "transparent",
                      },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Dvider */}
        <View
          style={[styles.hRule, { backgroundColor: t.colors.console.border }]}
        />

        {/* Sessions */}
        <Text style={[styles.sectionTitle, { color: t.colors.subtext }]}>
          Session {browseISO}
        </Text>

        <ScrollView
          style={{ maxHeight: 220 }}
          showsVerticalScrollIndicator={false}
        >
          {sessions.length === 0 ? (
            <Text style={{ color: t.colors.subtext, paddingVertical: 10 }}>
              No session logged.
            </Text>
          ) : (
            sessions.map((s) => (
              <View
                key={s.id}
                style={[
                  styles.sessionRow,
                  {
                    borderColor: t.colors.console.border,
                    backgroundColor: t.colors.console.chipBg,
                  },
                ]}
              >
                <Text style={{ color: t.colors.text, fontWeight: "900" }}>
                  {s.title}
                </Text>
                <Text style={{ color: t.colors.subtext, fontWeight: "800" }}>
                  {s.time ?? ""}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.closeBtn,
              {
                backgroundColor: t.colors.console.chipBg,
                borderColor: t.colors.console.border,
              },
            ]}
          >
            <Text style={{ color: t.colors.text, fontWeight: "900" }}>
              Close
            </Text>
          </Pressable>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  dowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pillDivider: {
    width: 1,
    height: 18,
    opacity: 0.8,
  },
  dow: {
    width: "14.285%",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 0.6,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cell: {
    width: "13.6%",
    aspectRatio: 1,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  footer: {
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  dayNum: {
    fontWeight: "800",
    transform: [{ translateY: -2 }],
  },
  closeBtn: {
    width: "75%",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  dotBottom: {
    position: "absolute",
    bottom: 2,
    left: "50%",
    width: 6,
    height: 6,

    transform: [{ translateX: -3 }],
    borderWidth: 2,
    borderRadius: 99,
  },

  hRule: { width: "100%", height: 1, opacity: 0.9, marginVertical: 12 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  sessionRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    height: 36,
    marginBottom: 10,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
});
