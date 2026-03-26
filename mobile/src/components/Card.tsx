import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export function Card({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: t.colors.card, borderColor: t.colors.border },
      ]}
    >
        <Text style={[styles.title, {color:t.colors.accent}]}>Example</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal:6
  },
  title: {
    fontSize:16,
    fontWeight:"600",
    textAlign:"center"
  }
});
