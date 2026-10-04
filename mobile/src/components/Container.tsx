// src/components/Container.tsx
import { View, StyleSheet, ViewProps, Platform } from "react-native";
import { ReactNode, useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";

type ContainerProps = ViewProps & {
  children: ReactNode;
  // Keep existing default-variant callers compatible.
  variant?: "default";
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
      alignItems: "stretch" as const,
    };

    const shadow = Platform.select({
      ios: {
        shadowColor: t.colors.shadow,
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 2 },
    });

    return StyleSheet.create({
      container: {
        ...base,
        backgroundColor: t.colors.surface,
        borderWidth: 1,
        borderColor: t.colors.border,
        ...shadow,
      },
    });
    }, [t, density]);


  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
}
