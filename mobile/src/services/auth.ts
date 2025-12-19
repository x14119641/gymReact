import { api } from "./api";
import type { User, RegisterPayload, Tokens } from "../types/user";



export async function login(identifier: string, password: string) {
  return api.post<Tokens>(
    "/auth/login",
    {
      identifier,
      password,
    }
  );
}

export async function register(email: string, username:string, password: string) {
  return api.post<User>(
    "/auth/register",
    {
      email,
      username,
      password,
    }
  );
}

export async function loadMe() {
  return api.get<User>("/users/me");
}

export async function logout() {
  return api.post<{ message: string }>("/auth/logout");
}
