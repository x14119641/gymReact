// src/components/Container.tsx
import { View, StyleSheet, ViewProps, Platform } from "react-native";
import { ReactNode, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";

type ContainerProps = ViewProps & {
  children: ReactNode;
  variant?: "default" | "console";
};

export function Container({ children, style, variant = "default", ...rest }: ContainerProps) {
  const t = useTheme();

  const styles = useMemo(() => {
    const base = {
      borderRadius: 16,
      padding: 16,
      marginVertical: 10,
      alignItems: "flex-start" as const,
      gap: 6,
    };

    if (variant === "console") {
      // translucent “console” pane — no elevation on Android
      return StyleSheet.create({
        container: {
          ...base,
          backgroundColor: t.colors.console.bg,
          borderWidth: 1,
          borderColor: t.colors.console.border,
          ...Platform.select({
            ios: {
              shadowColor: t.colors.shadow,
              shadowOpacity: 0.15,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            },
            android: { elevation: 0 },
          }),
        },
      });
    }

    // default solid card
    return StyleSheet.create({
      container: {
        ...base,
        backgroundColor: t.colors.card,
        borderWidth: 1,
        borderColor: t.colors.border,
        ...Platform.select({
          ios: {
            shadowColor: t.colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 3 },
          },
          android: { elevation: 4 },
        }),
      },
    });
  }, [t, variant]);

  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}
