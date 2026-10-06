import {
  View,
  StyleSheet,
  Text,
  Platform,
  ImageSourcePropType,
  Image,
  Pressable,
} from "react-native";
import { useMemo } from "react";
import { useTheme } from "../theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

type ExercisePickerRowProps = {
  image?: ImageSourcePropType;
  title: string;
  onAddPress?: () => void;
};

export function ExercisePickerRow({
  image,
  title,
  onAddPress,
}: ExercisePickerRowProps) {
  const t = useTheme();

  const styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,

        backgroundColor: t.colors.surface,
        borderColor: t.colors.border,
        borderWidth: 1,

        // Small visual accent for exercise rows
        borderLeftWidth: 3,
        borderLeftColor: t.colors.highlight,

        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
      },

      image: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: t.colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: t.colors.border,
      },

      title: {
        color: t.colors.text,
        fontSize: 15,
        fontWeight: "700",
      },

      addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: t.colors.surfaceSecondary,
      },
      info: {
        flex: 1,
        gap: 4,
      },
    });
  }, [t]);

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.image} />
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable
        style={styles.addButton}
        onPress={onAddPress}
        disabled={!onAddPress}
      >
        <Ionicons name="add-outline" size={20} color={t.colors.primary} />
      </Pressable>
    </View>
  );
}
