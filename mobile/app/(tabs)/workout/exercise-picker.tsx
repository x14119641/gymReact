import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { BaseLayout } from "@/src/components/BaseLayout";
import { useTheme } from "@/src/theme/ThemeProvider";
import { ExercisePickerRow } from "@/src/components/ExercisePickerRow";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { exercises } from "@/src/mocks/exercises.mock";
import { FilterSelectModal } from "@/src/components/FilterSelectModal";

const muscles = [
  "Chest",
  "Back",
  "Legs",
  "Glutes",
  "Calves",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Core",
];

const equipment = [
  "Barbell",
  "Dumbbell",
  "Bodyweight",
  "Cable",
  "Machine",
  "Other",
];

export default function ExercisePickerScreen() {
  const t = useTheme();
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [muscleModalOpen, setMuscleModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);

  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesMuscle = !selectedMuscle || exercise.muscle === selectedMuscle;

    const matchesEquipment =
      !selectedEquipment || exercise.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  return (
    <BaseLayout>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={t.colors.primary} />
      </Pressable>

      <View style={styles.header}>
        <Text style={[styles.title, { color: t.colors.text }]}>Library</Text>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: t.colors.surfaceSecondary,
              borderColor: t.colors.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={t.colors.textMuted}
          />

          <TextInput
            style={[styles.searchInput, { color: t.colors.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={t.colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.filters}>
          <Pressable
            style={[
              styles.filterButton,
              {
                backgroundColor: t.colors.surfaceSecondary,
                borderColor: t.colors.border,
              },
            ]}
            onPress={() => setMuscleModalOpen(true)}
          >
            <Text style={[styles.filterText, { color: t.colors.text }]}>
              {selectedMuscle ?? "Muscle"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={t.colors.textMuted}
            />
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              {
                backgroundColor: t.colors.surfaceSecondary,
                borderColor: t.colors.border,
              },
            ]}
            onPress={() => setEquipmentModalOpen(true)}
          >
            <Text style={[styles.filterText, { color: t.colors.text }]}>
              {selectedEquipment ?? "Equipment"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={t.colors.textMuted}
            />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.exerciseList}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <ExercisePickerRow
            title={item.title}
            onPress={() => router.push({pathname:"/workout/exercise", params: {exerciseId:item.id},
            })
          }
            onAddPress={() => console.log("Add", item.title)}
          />
        )}
      />

      <FilterSelectModal
        visible={muscleModalOpen}
        title="Muscle"
        options={muscles}
        selectedValue={selectedMuscle}
        onSelect={setSelectedMuscle}
        onClose={() => setMuscleModalOpen(false)}
      />
      <FilterSelectModal
        visible={equipmentModalOpen}
        title="Equipment"
        options={equipment}
        selectedValue={selectedEquipment}
        onSelect={setSelectedEquipment}
        onClose={() => setEquipmentModalOpen(false)}
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
    gap: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  exerciseList: {
    gap: 8,
    paddingBottom: 24,
    paddingRight: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    borderWidth: 1,

    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },

  searchInput: {
    flex: 1,

    fontSize: 15,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    flex: 1,
    height: 36,

    borderWidth: 1,

    borderRadius: 10,
  },

  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
