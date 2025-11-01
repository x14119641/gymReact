import { BaseLayout } from "@/src/components/BaseLayout";
import { Text, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <BaseLayout>
      <Text style={styles.text}>About Screen</Text>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "fff",
  },
});
