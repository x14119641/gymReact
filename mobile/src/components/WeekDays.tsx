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

function buildWeek(baseDate: Date) {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export default function WeekCard() {
  // layout / paging
  const [pageW, setPageW] = React.useState<number | null>(null);
  const [pageIndex, setPageIndex] = React.useState(1); // 0=prev,1=curr,2=next
  const listRef = React.useRef<FlatList<Date[]> | null>(null);

  // constants
  const PAD = 12;
  const GAP = 4;
  const COLS = 7;

  // base data
  const [baseDate] = React.useState(new Date());
  const today = React.useRef(new Date()).current;
  const anchorDate = React.useRef(today).current; // <-- fixed weekday anchor (today -thurdsay-)
  const [selectedDate, setSelectedDate] = React.useState<Date>(anchorDate);

  const prev = React.useMemo(() => buildWeek(subWeeks(baseDate, 1)), [baseDate]);
  const curr = React.useMemo(() => buildWeek(baseDate), [baseDate]);
  const next = React.useMemo(() => buildWeek(addWeeks(baseDate, 1)), [baseDate]);
  const pages = React.useMemo(() => [prev, curr, next], [prev, curr, next]);

  // header (which week is visible)
  const displayDate = React.useMemo(
    () => addWeeks(baseDate, pageIndex - 1),
    [baseDate, pageIndex]
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
      setSelectedDate(anchorDate);
    });
  }, [pageW, anchorDate]);

  // when swipe ends, reset selection to the ANCHOR weekday on that page
  const handlePageChange = (e: any) => {
    if (!pageW) return;
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / pageW); // 0/1/2
    const clamped = Math.max(0, Math.min(2, idx));
    setPageIndex(clamped);

    // new selected = anchor weekday shifted by page
    const anchorOnThisPage = addWeeks(anchorDate, clamped - 1);
    setSelectedDate(anchorOnThisPage);
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
            <Text style={styles.dayName}>{d}</Text>
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
                },
                isSelected && styles.selectedCell, 
              ]}
            >
              <Text
                style={[styles.dateText, isSelected && styles.selectedText]}
              >
                {format(d, "d")}
              </Text>

              {/* Tap to select (only affects current page; swipe will re-anchor) */}
              <Pressable
                onPress={() => setSelectedDate(d)}
                style={StyleSheet.absoluteFill}
              />
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.box} onLayout={onLayoutBox}>
      {!pageW ? (
        <Text style={styles.title}>Loading…</Text>
      ) : (
        <>
          <Text style={styles.title}>Week: {weekNumber}</Text>
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

          {/* Print your "X" variable (the selected full date) */}
          <Text style={styles.selectedLabel}>
            Selected: {format(selectedDate, "yyyy-MM-dd")}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 12, backgroundColor: "#111", borderRadius: 8 },
  title: { color: "#fff", fontWeight: "700", textAlign: "center", marginBottom: 8 },

  weekRowContainer: {},
  row: { flexDirection: "row", alignItems: "center" },

  slot: { alignItems: "center", justifyContent: "center" },

  dayName: { color: "#bbb", fontWeight: "600", textAlign: "center" },

  dateCell: { paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#444" },
  dateText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // only one highlight: the green selection
  selectedCell: {
    borderColor: "#67E8F9",
    backgroundColor: "rgba(103,232,249,0.22)",
  },
  selectedText: {
    color: "#E6FBFF",
    fontWeight: "800",
  },

  selectedLabel: {
    marginTop: 10,
    textAlign: "center",
    color: "#9ee7ff",
    fontWeight: "600",
  },
});
