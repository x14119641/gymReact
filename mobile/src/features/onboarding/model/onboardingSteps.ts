import type { ComponentType } from "react";
import type { OnboardingAnswers } from "./types";
import GoalStep from "../components/steps/GoalStep";
import DaysPerWeekStep from "../components/steps/DaysPerWeekStep";
import ExperienceStep from "../components/steps/ExperienceStep";
import EquipmentStep from "../components/steps/EquipmentStep";
import SessionLengthStep from "../components/steps/SessionLengthStep";
import InjuriesStep from "../components/steps/InjuriesStep";
import SportsBackgroundStep from "../components/steps/SportsBackgroundStep";


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
  makeStep({
    key: "experience_level",
    title: "What’s your training experience?",
    subtitle: "This helps us pick the right volume and progression.",
    optional: false,
    Component: ExperienceStep,
  }),
  makeStep({
    key: "equipment_access",
    title: "Where do you usually train?",
    subtitle: "Select all that apply.",
    optional: false,
    Component: EquipmentStep,
  }),
  makeStep({
    key: "session_length",
    title: "How long can you usually train?",
    subtitle: "Pick what you can sustain most days.",
    optional: false,
    Component: SessionLengthStep,
  }),
  makeStep({
    key: "injuries",
    title: "Anything we should be careful with?",
    subtitle: "Optional — but it helps keep training safe.",
    optional: true, 
    Component: InjuriesStep,
  }),
  makeStep({
  key: "sports_background",
  title: "Any sports you do now or did in the past?",
  subtitle: "Optional — helps personalize your training style.",
  optional: true,
  Component: SportsBackgroundStep,
}),
] as const;
