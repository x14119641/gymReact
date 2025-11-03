import { api } from "./api";

export async function login(email: string, password: string) {
  return api.post<{ access_token: string; refresh_token: string }>(
    "/auth/login",
    {
      email,
      password,
    }
  );
}

export async function loadMe() {
  return api.get<{ id: number; email: string; username: string }>("/users/me");
}

export async function logout() {
  return api.post<{ message: string }>("/auth/logout");
}
