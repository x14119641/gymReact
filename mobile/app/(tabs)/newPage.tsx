// app/index.tsx (or any screen)
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";
import { BaseLayout } from "@/src/components/BaseLayout";

export default function Home() {
  const t = useTheme();

  return (
    <BaseLayout>
      <Text style={[s.title, { color: t.colors.text }]}>
        Hello 👋 ({t.scheme} mode)
      </Text>

      <View
        style={[
          s.card,
          {
            backgroundColor: t.colors.card,
            borderColor: t.colors.border,
            shadowColor: t.colors.shadow,
          },
        ]}
      >
        <Text style={{ color: t.colors.subtext }}>Accent example:</Text>
        <Text
          style={{ color: t.colors.accent, fontWeight: "700", fontSize: 20 }}
        >
          2.10 : 1
        </Text>
      </View>
    </BaseLayout>
  );
}

const s = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",
    elevation: 4, // Android shadow
  },
});
