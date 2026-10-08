import { create } from "zustand";
import { WorkoutSession, WorkoutExercise } from "../types/workout";
import * as Crypto from "expo-crypto";

type WorkoutSessionStore = {
  activeSession: WorkoutSession | null;

  startWorkout: () => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (WorkoutExerciseId: string) => void;
};

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set) => ({
  activeSession: null,

  startWorkout: () =>
    set((state) => {
      if (state.activeSession) return state;

      return {
        activeSession: {
          id: Crypto.randomUUID(),
          startedAt: new Date().toISOString(),
          exercises: [],
          notes: "",
        },
      };
    }),

  addExercise: (exerciseId) =>
    set((state) => {
      if (!state.activeSession) return state;

      const workoutExercise: WorkoutExercise = {
        id: Crypto.randomUUID(),
        exerciseId,
        config: {
          targetSets: null,
          targetRepsMin: null,
          targetRepsMax: null,
          restSeconds: null,
        },
        sets: [],
      };

      return {
        activeSession: {
          ...state.activeSession,
          exercises: [...state.activeSession.exercises, workoutExercise],
        },
      };
    }),

  removeExercise: (workoutExerciseId) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          exercises: state.activeSession.exercises.filter(
            (exercise) => exercise.id !== workoutExerciseId,
          ),
        },
      };
    }),
}));
