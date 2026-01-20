export type User = { id: number; email: string; username: string };

export type RegisterPayload = {
  email: number;
  username: string;
  password: string;
};

export type LoginPayload = { identifier: string; password: string };

export type Tokens = { access_token: string; refresh_token: string };

export type ProfileUserRecord = {
  goal: string;
  days_per_week: string;
  experience_level: string;
  equipment_acces: [string];
  session_length: string;
  injuries: [string];
  sports_background: [string];
  created_at: Date;
  onboarding_completed_at: Date;
};
