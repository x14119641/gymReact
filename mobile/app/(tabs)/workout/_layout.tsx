import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="freestyle" />
      <Stack.Screen name="exercise-picker" />
      <Stack.Screen name="exercise" />
    </Stack>
  );
}