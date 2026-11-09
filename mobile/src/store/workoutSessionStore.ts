import { create } from "zustand";
import {
  WorkoutSession,
  WorkoutExercise,
  WorkoutExerciseConfig,
  WorkoutSet,
  WorkoutEffortType,
} from "../types/workout";
import * as Crypto from "expo-crypto";
import { exercises } from "../mocks/exercises.mock";

type WorkoutSessionStore = {
  activeSession: WorkoutSession | null;
  sessions: WorkoutSession[];

  completeWorkout: (effort: WorkoutEffortType | null) => void;

  startWorkout: () => void;
  openWorkout: (sessionId: string) => void;
  resetWorkout: () => void;
  updateNotes: (notes: string) => void;
  updateName: (name: string) => void;
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

export const selectActiveSession = (state: WorkoutSessionStore) =>
  state.activeSession;

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set) => ({
  activeSession: null,
  sessions: [],
  openWorkout: (sessionId) =>
    set((state) => {
      const selectedSession = state.sessions.find(
        (session) => session.id === sessionId,
      );

      if (!selectedSession) return state;

      return {
        activeSession: selectedSession,
        sessions: [
          ...state.sessions.filter((session) => session.id !== sessionId),
          ...(state.activeSession ? [state.activeSession] : []),
        ],
      };
    }),

  resetWorkout: () => set({ activeSession: null, sessions: [] }),
  updateName: (name) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          name,
        },
      };
    }),
  updateNotes: (notes) =>
    set((state) => {
      if (!state.activeSession) return state;

      return {
        activeSession: {
          ...state.activeSession,
          notes,
        },
      };
    }),

  startWorkout: () =>
    set((state) => {
      return {
        sessions: state.activeSession
          ? [...state.sessions, state.activeSession]
          : state.sessions,
        activeSession: {
          id: Crypto.randomUUID(),
          name: "Freestyle Session",
          instructions: null,
          startedAt: new Date().toISOString(),
          exercises: [],
          notes: "",
          effort: null,
          completedAt: null,
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

  completeWorkout: (effort) =>
    set((state) => {
      const session = state.activeSession;

      if (!session || session.exercises.length === 0) {
        return state;
      }

      const completedSession: WorkoutSession = {
        ...session,
        completedAt: new Date().toISOString(),
        effort,
      };

      return {
        sessions: [...state.sessions, completedSession],
        activeSession: null,
      };
    }),
}));
