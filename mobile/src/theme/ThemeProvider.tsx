import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors, ThemeColors } from "./colors";

type ThemeMode = "system" | "light" | "dark";

type ThemeContextValue = {
    mode: ThemeMode;
    scheme: "light" | "dark";
    setMode : (m:ThemeMode) =>void;
    colors: ThemeColors;
    radius:number;
    space:number;
};

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({children}:{ children: React.ReactNode}) {
    
    const system = useColorScheme(); // follows OS: "light" | "dark" | null
    const systemScheme: "light" | "dark" = system === "dark" ? "dark" : "light";

    // console.log("CONSOLE", system)

    //  MOck state
    const [mode, setMode] = useState<ThemeMode>("light");

    const scheme: "light" | "dark" = mode === "system" ? systemScheme: mode;

    // const scheme: "light" | "dark" = "light"; // Force light
    const value = useMemo<ThemeContextValue>(() => {
        const colors = scheme === "light" ?  lightColors: darkColors;
        return {
            mode, scheme, setMode, colors, radius:12, space:8,
        };
    }, [mode, scheme]);
    return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeCtx);
    if(!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
    return ctx;
}