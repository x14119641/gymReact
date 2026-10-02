import { api } from "./api";
import type { OnboardingAnswers } from "../features/onboarding/model/types";


export async function submitOnboarding(payload:OnboardingAnswers) {
    const r = await api.post("/profile/onboarding", {
        goal: payload.goal,
        days_per_week: payload.daysPerWeek,
        experience_level: payload.experienceLevel,
        equipment_access: payload.equipmentAccess,
        session_length: payload.sessionLength,
        injuries: payload.injuries,
        sports_background: payload.sportsBackground,
    });
    return r.data;
}


export async function loadMyProfile() {
    const r = await api.get("/profile/me");
    console.log("[loadMyProfile] status", r.status, "data", r.data);
    return r.data;
}