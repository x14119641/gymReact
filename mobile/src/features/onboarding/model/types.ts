export type Goal =
  | "strength"
  | "rehabilitation"
  | "hypertrophy"
  | "fat_loss"
  | "mobility"
  | "performance"
  | "unsure";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "returning";

export type EquipmentAccess =
  | "gym"
  | "home_gym"
  | "bodyweight"
  | "park"
  | "mixed";

export type InjuryArea =
  | "shoulder"
  | "elbow"
  | "neck"
  | "wrist_hand"
  | "back"
  | "hip"
  | "knee"
  | "ankle";

export type SportBackground =
  | "weights"
  | "athletism"
  | "cycling"
  | "calisthenics"
  | "running"
  | "martial_arts"
  | "team_sports"
  | "climbing"
  | "yoga_mobility"
  | "swimming"
  | "other";

export type SessionLength = "30" | "45" | "60" | "90_plus";

export type DaysPerWeek = "2" | "3" | "4" | "5_plus";

export type OnboardingAnswers = {
  goal: Goal | null;
  days_per_week: DaysPerWeek | null;

  experience_level: ExperienceLevel | null;
  equipment_access: EquipmentAccess[];
  injuries: InjuryArea[];
  sports_background: SportBackground[];
  session_length: SessionLength | null;
};

export const DEFAULT_ONBOARDING_ANSWERS: OnboardingAnswers = {
  goal: null,
  days_per_week: null,
  experience_level: null,
  equipment_access: [],
  injuries: [],
  sports_background: [],
  session_length: null,
};