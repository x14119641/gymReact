import React, { useMemo, useState } from "react";
import { View, Alert } from "react-native";
import OnboardingStepLayout from "../components/OnboardingStepLayout";
import {
  DEFAULT_ONBOARDING_ANSWERS,
  type OnboardingAnswers,
} from "../model/types";
import { ONBOARDING_STEPS } from "../model/onboardingSteps";
import OnboardingReview from "../components/OnboardingReview";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { submitOnboarding } from "@/src/services/profile";


export default function OnboardingFlowScreen() {
  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    DEFAULT_ONBOARDING_ANSWERS
  );

  const dataStepsCount = ONBOARDING_STEPS.length;
  const isReviewStep = stepIndex === dataStepsCount;

  const totalStepsShown = dataStepsCount + 1;
  const stepNumber = stepIndex + 1;

  const step = !isReviewStep ? ONBOARDING_STEPS[stepIndex] : null;
  const valueForStep = step ? answers[step.key] : null;

  const canGoNext = useMemo(() => {
    // Required steps:
    // - value must not be null
    // - value must not be null
    // - arrays must have at least one item
    if (isReviewStep) return true;
    if (!step) return false;
    if (step.optional) return true;

    if (Array.isArray(valueForStep)) return valueForStep.length > 0;
    return valueForStep !== null;

  }, [isReviewStep,step, valueForStep]);

  function setStepValue(next: any) {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.key]: next } as OnboardingAnswers));
  }

  function goBack() {
    if (stepIndex === 0) {
      Alert.alert("Onboarding", "You are on the first step.");
      return;
    }
    setStepIndex((i) => i - 1);
  }

  async function goNext() {
    if (isReviewStep) {
      try {
        await submitOnboarding(answers);
        router.replace("/(tabs)");
        return;
      } catch (error) {
        Alert.alert(`Onboarding failed with error:  ${error}`)
        return; // stay on the review page page
      }
    }
     // If we're on the last data step, next goes to Review
    setStepIndex((i) => Math.min(i + 1, dataStepsCount));
  }

  function skip() {
    if (!step) return;
    // arrays store as [], scalaras as null
    const skippedValue = Array.isArray(answers[step.key]) ? [] : null;

    setAnswers((prev) => ({...prev, [step.key]:skippedValue}) as OnboardingAnswers);
    setStepIndex((i) => Math.min(i+1, dataStepsCount));
  }

  const primaryLabel = isReviewStep ? "Finish" : "Next";

  return (
    <View style={{ flex: 1 }}>
      <OnboardingStepLayout
        stepNumber={stepNumber}
        totalSteps={totalStepsShown}
        title={isReviewStep ? "All set" : step!.title}
        subtitle={
          isReviewStep
            ? "Review your choices. You can change them anytime later."
            : step!.subtitle
        }
        primaryLabel={primaryLabel}
        canGoNext={canGoNext}
        onBack={goBack}
        onNext={goNext}
        onSkip={!isReviewStep && step!.optional ? skip : undefined}
      >
        {isReviewStep ? (
          <OnboardingReview answers={answers} />
        ) : (
          (() => {
            const StepComponent = step!.Component as ComponentType<any>;
            return <StepComponent value={valueForStep as any} onChange={setStepValue} />;
          })()
        )}
      </OnboardingStepLayout>
    </View>
  );
}
