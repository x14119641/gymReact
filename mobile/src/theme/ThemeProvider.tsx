import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors, ThemeColors } from "./colors";

type ThemeContextValue = {
    scheme: "light" | "dark";
    colors: ThemeColors;
    radius:number;
    space:number;
};

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}:{ children: React.ReactNode}) {
    // follows OS: "light" | "dark" | null
    const system = useColorScheme();
    console.log("CONSOLE", system)
    const scheme: "light" | "dark" = system === "dark" ? "dark" : "light";
    // const scheme: "light" | "dark" = "light"; // Force light
    const value = useMemo<ThemeContextValue>(() => {
        const colors = scheme === "light" ?  lightColors: darkColors;
        return {
            scheme, colors, radius:12, space:8,
        };
    }, [scheme]);
    return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeCtx);
    if(!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
    return ctx;
}