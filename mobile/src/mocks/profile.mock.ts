import type { OnboardingAnswers } from "../features/onboarding/model/types";



export type ThemeMode = "light" | "dark" | "system";
export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "ft";
export type WeekStartDay = "mon" | "sun";

export type UserDTO = {
    id:number; username:string,email:string, createdAt:string,
}

export type UserProfileDTO = {
    // Dont have this now, just thnking
    // I guess i will need to store height with the metrick and another column with the normalized height in cm"
    // same idea for wheight kg vs lb
    heightCm: number |null;
    bodyweightKg: number |null;
}

export type UserSettingsDTO = {
    theme : ThemeMode;
    weightUnit: WeightUnit;
    heightUnit: HeightUnit;
    weekStartDay: WeekStartDay;
}

export type ProfileDTO = {
    user:UserDTO;
    onboarding: OnboardingAnswers & {completedAt: string|null};
    profile:UserProfileDTO;
    settings:UserSettingsDTO;
}


export const mockProfile: ProfileDTO = {
  user: {
    id: 1,
    username: "test",
    email: "test@test.com",
    createdAt: "2026-01-10T10:00:00.000Z",
  },

  onboarding: {
    goal: "performance",
    daysPerWeek: "4",
    experienceLevel: "returning",
    equipmentAccess: ["mixed"],
    injuries: ["shoulder"],
    sportsBackground: ["martial_arts"],
    sessionLength: "45",
    completedAt: null,
  },

  profile: {
    heightCm: null,
    bodyweightKg: null,
  },

  settings: {
    theme: "system",
    weightUnit: "kg",
    heightUnit: "cm",
    weekStartDay: "mon",
  },
};