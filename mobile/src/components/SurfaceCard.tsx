import { View, StyleSheet, ViewProps, Platform } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

type SurfaceCardProps = ViewProps;

export function SurfaceCard({
  children,
  style,
  ...rest
}: SurfaceCardProps) {
  const t = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.border,
        },
        Platform.select({
          ios: {
            shadowColor: t.colors.shadow,
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 3 },
          },
          android: { elevation: 2 },
        }),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 10,
    alignItems: "stretch",
  },
});