import { Text, View } from "react-native";
import { ThemeProvider } from "@/src/theme/ThemeProvider";

export default function Index() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    </ThemeProvider>
  );
}