import { api } from "./api";

export async function login(email:string, password:string) {
    return api<{access_token:string, refresh_token:string}>("/auth/login", {
        method:"POST",
        body: JSON.stringify({email, password})
    })
}


export async function loadMe(accessToken:string) {
    return api<{id:number, email:string, username:string}>("/users/me", {
        method:"GET",
        headers:{"Authorization":`Bearer ${accessToken}`},
    });
}

export async function logout() {
    return api<{message:string}>("/auth/logout", {
        method:"POST",
    });
}