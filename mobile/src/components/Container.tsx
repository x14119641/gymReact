// src/components/Container.tsx
import { View, StyleSheet, ViewProps, Platform } from "react-native";
import { ReactNode, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";

type ContainerProps = ViewProps & {
  children: ReactNode;
  variant?: "default" | "console";
  density?: "default" | "compact";
};

export function Container({ children, style, variant = "default", density="default", ...rest }: ContainerProps) {
  const t = useTheme();

  const styles = useMemo(() => {
    // "container size"
    const pad = density ==="compact" ? 14:16;

    const base = {
      borderRadius: 16,
      padding: pad,
      marginVertical: 10,
      alignItems: "flex-start" as const,
    };

    // Slightly different styles CArd vs "console"
    const surfaceBg = variant === "console" ? t.colors.console.bg:t.colors.card;
    const surfaceBorder = variant === "console" ? t.colors.console.border : t.colors.border;

    // Keep shadow consistent across variants (so it's one system)
    const shadow = Platform.select({
      ios: {
        shadowColor: t.colors.shadow,
        shadowOpacity: variant === "console" ? 0.08 : 0.12,
        shadowRadius: variant === "console" ? 8 : 10,
        shadowOffset: { width: 0, height: variant === "console" ? 2 : 3 },
      },
      android: { elevation: 2 },
    });

    return StyleSheet.create({
      container: {
        ...base,
        backgroundColor: surfaceBg,
        borderWidth: 1,
        borderColor: surfaceBorder,
        ...shadow,
      },
    });
    }, [t, variant, density]);


  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}
