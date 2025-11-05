import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { format, addDays, getWeek, eachDayOfInterval } from "date-fns";
import { Container } from "./Container";

export default function WeekDaysCard() {
  const t = useTheme();
  let weekNumber = getWeek(new Date(), {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  });

  return (
    <Container variant="console">
      <Text style={[styles.title, { color: t.colors.text }]}>
        Week: <Text style={{ color: t.colors.accent }}>{weekNumber}</Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
});
