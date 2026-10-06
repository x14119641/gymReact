import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { Container } from "@/src/components/Container";
import { ExercisePickerRow } from "@/src/components/ExercisePickerRow";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function ExercisePickerScreen() {
  const t = useTheme();
  const router = useRouter();

  const exercises = [
    { id: "barbell-squat", title: "Barbell Squat" },
    { id: "bench-press", title: "Bench Press" },
    { id: "pull-up", title: "Pull Up" },
    { id: "romanian-deadlift", title: "Romanian Deadlift" },
    { id: "overhead-press", title: "Overhead Press" },
    { id: "bulgarian-split-squat", title: "Bulgarian Split Squat" },
    { id: "incline-dumbbell-press", title: "Incline Dumbbell Press" },
    { id: "seated-row", title: "Seated Row" },
    { id: "leg-curl", title: "Leg Curl" },
    { id: "hip-thrust", title: "Hip Thrust" },
  ];

  return (
    <BaseLayout>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={t.colors.highlight} />
      </Pressable>

      <Container variant="default" density="compact">
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.colors.text }]}>Library</Text>
          <Text style={{ color: t.colors.textMuted }}>
            Here i guess the search
          </Text>
        </View>
      </Container>

            <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.exerciseList}
        renderItem={({ item }) => (
          <ExercisePickerRow
            title={item.title}
            onAddPress={() => {
              console.log("Add", item.title);
            }}
          />
        )}
      />

      
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: "flex-start",
    padding: 6,
  },
  pressed: { opacity: 0.75 },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  exerciseList: {
    gap: 8,
    paddingBottom: 24,
  },
});
