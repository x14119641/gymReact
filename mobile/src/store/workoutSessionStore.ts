import { create } from "zustand";
import {
  WorkoutSession,
  WorkoutExercise,
  WorkoutExerciseConfig,
  WorkoutSet,
} from "../types/workout";
import * as Crypto from "expo-crypto";
import { exercises } from "../mocks/exercises.mock";

type WorkoutSessionStore = {
  activeSession: WorkoutSession | null;

  startWorkout: () => void;
  resetWorkout: () => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (WorkoutExerciseId: string) => void;
  updateExerciseConfig: (
    workoutExerciseId: string,
    config: Partial<WorkoutExerciseConfig>,
  ) => void;
  addSet: (workoutExerciseId: string) => void;
  ensureExerciseSets: (workoutExerciseId: string) => void;
  updateSet: (
    workoutExerciseId: string,
    setId: string,
    patch: Partial<Pick<WorkoutSet, "reps" | "weightKg" | "durationSeconds">>,
  ) => void;
};

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set) => ({
  activeSession: null,

  resetWorkout: () => set({ activeSession: null }),

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

      const catalogExercise = exercises.find(
        (exercise) => exercise.id === exerciseId,
      );

      if (!catalogExercise) return state;

      const config: WorkoutExerciseConfig = {
        ...catalogExercise.defaultConfig,
      };

      const initialSets: WorkoutSet[] = Array.from(
        { length: config.targetSets ?? 0 },
        () => ({
          id: Crypto.randomUUID(),
          reps: null,
          weightKg: null,
          durationSeconds: null,
        }),
      );

      const workoutExercise: WorkoutExercise = {
        id: Crypto.randomUUID(),
        exerciseId,
        config,
        sets: initialSets,
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

  updateExerciseConfig: (workoutExerciseId, config) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          exercises: state.activeSession.exercises.map((exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  config: {
                    ...exercise.config,
                    ...config,
                  },
                }
              : exercise,
          ),
        },
      };
    }),
  addSet: (workoutExerciseId) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          exercises: state.activeSession.exercises.map((exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: [
                    ...exercise.sets,
                    {
                      id: Crypto.randomUUID(),
                      reps: null,
                      weightKg: null,
                      durationSeconds: null,
                    },
                  ],
                }
              : exercise,
          ),
        },
      };
    }),
  ensureExerciseSets: (workoutExerciseId) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          exercises: state.activeSession.exercises.map((exercise) => {
            if (exercise.id !== workoutExerciseId) return exercise;

            const target = exercise.config.targetSets ?? 0;
            const missing = Math.max(0, target - exercise.sets.length);

            if (missing === 0) return exercise;

            const newSets: WorkoutSet[] = Array.from(
              { length: missing },
              () => ({
                id: Crypto.randomUUID(),
                reps: null,
                weightKg: null,
                durationSeconds: null,
              }),
            );

            return {
              ...exercise,
              sets: [...exercise.sets, ...newSets],
            };
          }),
        },
      };
    }),
  updateSet: (workoutExerciseId, setId, patch) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          exercises: state.activeSession.exercises.map((exercise) =>
            exercise.id === workoutExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((workoutSet) =>
                    workoutSet.id === setId
                      ? { ...workoutSet, ...patch }
                      : workoutSet,
                  ),
                }
              : exercise,
          ),
        },
      };
    }),
}));
