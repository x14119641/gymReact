import { Text, View, StyleSheet } from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Container } from "@/src/components/Container";

export default function FreestyleWorkoutScreen() {
  const t = useTheme();

  const today = new Date();

  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <BaseLayout>
      <Container variant="default" density="compact">
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.colors.text }]}>Freestyle Workout</Text>
          <Text style={[styles.date, { color: t.colors.textMuted }]}>{formattedDate}</Text>
        </View>
        
      </Container>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  date: {
    fontSize: 14,
  },
  rowHeader: {
    flex:1,
    flexDirection:"row"
  }
});
