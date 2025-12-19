import type { OnboardingAnswers } from "./types";
import GoalStep from "../components/steps/GoalStep";
import DaysPerWeekStep from "../components/steps/DaysPerWeekStep";
import type { ComponentType } from "react";


export type StepKey = keyof OnboardingAnswers;

export type OnboardingStepDef<K extends StepKey = StepKey> = {
  key: K;
  title: string;
  subtitle?: string;
  optional: boolean;
  Component: ComponentType<{
    value: OnboardingAnswers[K];
    onChange: (next: OnboardingAnswers[K]) => void;
  }>;
};

// This binds K correctly per object literal
function makeStep<K extends StepKey>(step: OnboardingStepDef<K>) {
  return step;
}

export const ONBOARDING_STEPS = [
  makeStep({
    key: "goal",
    title: "What’s your main goal right now?",
    subtitle: "You can change this anytime later.",
    optional: false,
    Component: GoalStep,
  }),
  makeStep({
    key: "days_per_week",
    title: "How many days per week can you realistically train?",
    subtitle: "Pick what you can sustain, not your perfect week.",
    optional: false,
    Component: DaysPerWeekStep,
  }),
] as const;