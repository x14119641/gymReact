import { api } from "./api";
import type { OnboardingAnswers } from "../features/onboarding/model/types";


export async function submitOnboarding(payload:OnboardingAnswers) {
    const r = await api.post("/profile/onboarding", payload);
    return r.data;
}


export async function loadMyProfile() {
    const r = await api.get("/profile/me");
    console.log("[loadMyProfile] status", r.status, "data", r.data);
    return r.data;
}