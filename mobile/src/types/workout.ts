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
  startedAt: string;
  exercises: WorkoutExercise[];
  notes: string;
};



