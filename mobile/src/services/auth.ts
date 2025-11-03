import { api } from "./api";

export async function login(email:string, password:string) {
    console.log(email, password)
    return api<{access_token:string, refresh_token:string}>("/auth/login", {
        method:"POST",
        body: JSON.stringify({email, password})
    })
}

export async function logout() {
    return api<{message:string}>("/auth/logout", {
        method:"POST"
    });
}