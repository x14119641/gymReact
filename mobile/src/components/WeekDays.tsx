import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  LayoutChangeEvent,
} from "react-native";
import {
  format,
  startOfWeek,
  addWeeks,
  getWeek,
  subWeeks,
  addDays,
  isSameDay,
} from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Container } from "./Container";
import { useTheme } from "../theme/ThemeProvider";
import { useDateStore } from "../store/dateStore";
import { Link, useRouter } from "expo-router";

function buildWeek(baseDate: Date) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export default function WeekCard() {
  const t = useTheme();
  const router = useRouter();
  // layout / paging
  const [pageW, setPageW] = React.useState<number | null>(null);
  const [pageIndex, setPageIndex] = React.useState(1); // 0=prev,1=curr,2=next
  const listRef = React.useRef<FlatList<Date[]> | null>(null);

  // constants
  const PAD = 0;
  const GAP = 4;
  const COLS = 7;

  // base data
  const [baseDate] = React.useState(new Date());
  const today = React.useRef(new Date()).current;
  const anchorDate = React.useRef(today).current; // <-- fixed weekday anchor (today -thurdsay-)
  const homeDateISO = useDateStore((s) => s.homeDateISO);
  const setHomeDateISO = useDateStore((s) => s.setHomeDateISO);
  const selectedDate = React.useMemo(
    () => new Date(homeDateISO),
    [homeDateISO],
  );

  const prev = React.useMemo(
    () => buildWeek(subWeeks(baseDate, 1)),
    [baseDate],
  );
  const curr = React.useMemo(() => buildWeek(baseDate), [baseDate]);
  const next = React.useMemo(
    () => buildWeek(addWeeks(baseDate, 1)),
    [baseDate],
  );
  const pages = React.useMemo(() => [prev, curr, next], [prev, curr, next]);

  // header (which week is visible)
  const displayDate = React.useMemo(
    () => addWeeks(baseDate, pageIndex - 1),
    [baseDate, pageIndex],
  );
  const weekNumber = getWeek(displayDate, {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });

  // widths from container
  // cell width except Sunday
  const cellW = React.useMemo(() => {
    if (!pageW) return 0;
    const inner = pageW - PAD * 2 - GAP * (COLS - 1);
    return Math.floor(inner / COLS);
  }, [pageW]);
  // sunday get the leftover pixesl so total == inner exactly
  const lastCellW = React.useMemo(() => {
    if (!pageW) return 0;
    const inner = pageW - PAD * 2 - GAP * (COLS - 1);
    return inner - cellW * (COLS - 1); // Sunday gets the remainder
  }, [pageW, cellW]);

  const onLayoutBox = (e: LayoutChangeEvent) => {
    setPageW(e.nativeEvent.layout.width);
  };

  // jump to middle page once width is known
  React.useEffect(() => {
    if (!pageW || !listRef.current) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: 1, animated: false });
      // ensure selection is the anchor on current page
      setHomeDateISO(format(anchorDate, "yyyy-MM-dd"));
    });
  }, [pageW, anchorDate, setHomeDateISO]);

  // when swipe ends, reset selection to the ANCHOR weekday on that page
  const handlePageChange = (e: any) => {
    if (!pageW) return;
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / pageW); // 0/1/2
    const clamped = Math.max(0, Math.min(2, idx));
    setPageIndex(clamped);

    // new selected = anchor weekday shifted by page
    const anchorOnThisPage = addWeeks(anchorDate, clamped - 1);
    setHomeDateISO(format(anchorOnThisPage, "yyyy-MM-dd"));
  };

  const DayNames = () => (
    <View style={[styles.weekRowContainer, { paddingHorizontal: PAD }]}>
      <View style={styles.row}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <View
            key={d}
            style={[
              styles.slot,
              {
                width: i === COLS - 1 ? lastCellW : cellW,
                marginRight: i < COLS - 1 ? GAP : 0,
              },
            ]}
          >
            <Text style={[styles.dayName, { color: t.colors.subtext }]}>
              {d}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const WeekStrip = ({ dates }: { dates: Date[] }) => (
    <View
      style={[
        styles.weekRowContainer,
        { width: pageW ?? 0, paddingHorizontal: PAD },
      ]}
    >
      <View style={styles.row}>
        {dates.map((d, i) => {
          const isSelected = isSameDay(d, selectedDate);
          return (
            <View
              key={d.toISOString()}
              style={[
                styles.slot,
                styles.dateCell,
                {
                  width: i === COLS - 1 ? lastCellW : cellW,
                  marginRight: i < COLS - 1 ? GAP : 0,
                  borderColor: isSelected
                    ? t.colors.accent
                    : t.colors.console.border,
                  backgroundColor: isSelected
                    ? t.colors.console.chipBg
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  { color: t.colors.text },
                  isSelected && { fontWeight: "900" },
                ]}
              >
                {format(d, "d")}
              </Text>

              {/* Tap to select (only affects current page; swipe will re-anchor) */}
              <Pressable
                onPress={() => setHomeDateISO(format(d, "yyyy-MM-dd"))}
                style={StyleSheet.absoluteFill}
              />
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <Container variant="default" density="compact">
      <View style={{ width: "100%" }} onLayout={onLayoutBox}>
        {!pageW ? (
          <Text style={[styles.title, { color: t.colors.subtext }]}>
            Loading…
          </Text>
        ) : (
          <>
            <View style={styles.headerRow}>
              {/* empty space in order to week be in the center */}
              <View style={styles.headerSpacer} />
              <Text
                style={[styles.headerCentered, { color: t.colors.text }]}
                numberOfLines={1}
              >
                Week: {weekNumber}
              </Text>

              <Link href="/(modals)/calendar" asChild>
                <Pressable style={styles.headerAction} hitSlop={20}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={t.colors.text}
                  />
                </Pressable>
              </Link>
            </View>

            <DayNames />

            <FlatList
              ref={listRef}
              horizontal
              pagingEnabled
              bounces={false}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              data={pages}
              keyExtractor={(_, idx) =>
                idx === 0 ? "prev" : idx === 1 ? "curr" : "next"
              }
              renderItem={({ item }) => <WeekStrip dates={item} />}
              getItemLayout={(_, index) => ({
                length: pageW!,
                offset: pageW! * index,
                index,
              })}
              initialNumToRender={3}
              onMomentumScrollEnd={handlePageChange}
              removeClippedSubviews={false}
            />
            {/* Horizontal bar */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: t.colors.console.border,
                marginVertical: 12,
              }}
            />
            <Pressable onPress={() => console.log("ADD it!")}>
              {/* <Ionicons name={"add"} size={20} color={"#697657"} style={styles.icon} /> */}
              <Text
                style={{
                  color: t.colors.accent,
                  paddingHorizontal: 12,
                  textDecorationLine: "underline",
                  fontWeight: "900",
                }}
              >
                Add Workout
              </Text>
            </Pressable>

            {/* Print your "X" variable (the selected full date) */}
            <Text style={[styles.selectedLabel, { color: t.colors.subtext }]}>
              Selected: {homeDateISO}
            </Text>
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.6,
  },

  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
},

headerSpacer: {
  width: 36, // MUST match headerAction touch width
},

headerCentered: {
  flex: 1,
  textAlign: "center",
  fontSize: 12,
  fontWeight: "900",
  letterSpacing: 0.8,
},

headerAction: {
  width: 36,
  alignItems: "center",
  justifyContent: "center",
},

  weekRowContainer: {},
  row: { flexDirection: "row", alignItems: "center" },
  slot: { alignItems: "center", justifyContent: "center" },

  dayName: { fontWeight: "700", textAlign: "center", fontSize: 12 },

  dateCell: { paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  dateText: { fontSize: 16, fontWeight: "800" },

  selectedLabel: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "700",
  },
});
