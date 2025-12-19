import React, { useMemo, useState } from "react";
import { View, Alert } from "react-native";
import OnboardingStepLayout from "../components/OnboardingStepLayout";
import {
  DEFAULT_ONBOARDING_ANSWERS,
  type OnboardingAnswers,
} from "../model/types";
import { ONBOARDING_STEPS } from "../model/onboardingSteps";

export default function OnboardingFlowScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(
    DEFAULT_ONBOARDING_ANSWERS
  );

  const step = ONBOARDING_STEPS[stepIndex];
  const totalSteps = ONBOARDING_STEPS.length;
  const stepNumber = stepIndex + 1;

  const valueForStep = answers[step.key];

  const canGoNext = useMemo(() => {
    if (step.optional) return true;

    // Required steps:
    // - value must not be null
    // - arrays must have at least one item
    if (valueForStep === null) return false;
    if (Array.isArray(valueForStep)) return valueForStep.length > 0;
    return true;
  }, [step.optional, valueForStep]);

  function setStepValue(next: typeof valueForStep) {
    setAnswers((prev) => ({...prev, [step.key]:next}) as OnboardingAnswers)
  }

  function goBack() {
    if (stepIndex === 0) {
        // If this is a modal, you might close it here. For now do nothing
        Alert.alert("Onboarding", "You are on the first step.");
        return;
    }
    setStepIndex((i)=> i-1);
  }

  function goNext() {
    if (stepIndex===totalSteps-1) {
        // For now just show payload, but after will POST answers to backend once the onboarding is complated and navigate to tabs.
        Alert.alert("Onboarding payload", JSON.stringify(answers, null, 2));
        return ;
    }
    setStepIndex((i)=>i+1);
  }

  function skip() {
    // Only for optional steps (we’ll hide skip otherwise)
    // Define "skipped" values:
    const skippedValue =
      valueForStep === null ? null : Array.isArray(valueForStep) ? [] : null;

    setStepValue(skippedValue as any);
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  const PrimaryLabel = stepIndex === totalSteps - 1 ? "Finish" : "Next";

  const StepComponent = step.Component;

  return (
    <View style={{ flex: 1 }}>
      <OnboardingStepLayout
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        title={step.title}
        subtitle={step.subtitle}
        primaryLabel={PrimaryLabel}
        canGoNext={canGoNext}
        onBack={goBack}
        onNext={goNext}
        onSkip={step.optional ? skip : undefined}
      >
        <StepComponent value={valueForStep as any} onChange={setStepValue as any} />
      </OnboardingStepLayout>
    </View>
  );
}
