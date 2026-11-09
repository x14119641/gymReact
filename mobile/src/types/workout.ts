export type WorkoutEffortType =
  | 1 // very_easy"
  | 2 // "easy"
  | 3 // "somewhat easy"
  | 4 // "moderate"
  | 5 // "somewhat hard"
  | 6 // "very_hard"
  | 7 // "maximum_effort";

export type WorkoutSet = {
  id: string;
  reps: number | null;
  weightKg: number | null;
  durationSeconds: number | null;
};

export type WorkoutExerciseConfig = {
  targetSets: number | null;
  targetRepsMin: number | null;
  targetRepsMax: number | null;
  restSeconds: number | null;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  config: WorkoutExerciseConfig;
  sets: WorkoutSet[];
};

export type WorkoutSession = {
  id: string;
  name: string;
  instructions: string |null;
  startedAt: string;
  exercises: WorkoutExercise[];
  notes: string | null;
  effort: WorkoutEffortType | null;
  completedAt: string | null;
  updatedAt?: string | null;
};
