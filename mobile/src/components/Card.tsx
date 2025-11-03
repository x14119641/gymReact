import { View, StyleSheet, ViewProps } from "react-native";
import { ReactNode } from "react";
import { useTheme } from "../theme/ThemeProvider";

type CardProps = ViewProps & { children: ReactNode };

export function Card({ children, style, ...rest }: CardProps) {
  const t = useTheme();
  const styles = StyleSheet.create({
    card: {
      borderRadius: 16,
      backgroundColor: t.colors.card,
      padding: 16,
      marginVertical: 10,
      shadowColor: t.colors.shadow,
      shadowOpacity: 0.1,
      shadowRadius: t.radius,
      elevation: 4,
    },
  });
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}
