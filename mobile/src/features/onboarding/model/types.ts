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
  | "athletics"
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
  daysPerWeek: DaysPerWeek | null;
  experienceLevel: ExperienceLevel | null;
  equipmentAccess: EquipmentAccess[];
  injuries: InjuryArea[];
  sportsBackground: SportBackground[];
  sessionLength: SessionLength | null;
};
export const DEFAULT_ONBOARDING_ANSWERS: OnboardingAnswers = {
  goal: null,
  daysPerWeek: null,
  experienceLevel: null,
  equipmentAccess: [],
  injuries: [],
  sportsBackground: [],
  sessionLength: null,
};