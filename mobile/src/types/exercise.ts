import type { WorkoutExerciseConfig } from "./workout";

export type ExerciseTrackingType = "reps" | "duration";

export type Exercise = {
  id: string;
  title: string;
  muscle: string;
  equipment: string;
  trackingType: ExerciseTrackingType;
  defaultConfig: WorkoutExerciseConfig;
};