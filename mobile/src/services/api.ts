
import { Platform } from "react-native";


const DEFAULT_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://127.0.0.1:8000";
// const API_URL = process.env.EXPO_BASE_URL ?? BASE_URL;

export async function api<T>(path:string, init?:RequestInit): Promise<T> {
    console.log(`${DEFAULT_BASE_URL}${path}`)
    const res = await fetch(`${DEFAULT_BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {})},
        ...init,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json()
}


