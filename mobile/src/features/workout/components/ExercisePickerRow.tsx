import {
  View,
  StyleSheet,
  Text,
  ImageSourcePropType,
  Image,
  Pressable,
} from "react-native";
import { useMemo } from "react";
import { useTheme } from "../../../theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

type ExercisePickerRowProps = {
  image?: ImageSourcePropType;
  title: string;
  isSelected: boolean;
  isAdded: boolean;
  onPress?: () => void;
  onAddPress?: () => void;
};

export function ExercisePickerRow({
  image,
  title,
  isSelected,
  isAdded,
  onPress,
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
      exerciseInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
    });
  }, [t]);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.exerciseInfo}
        onPress={onPress}
        disabled={!onPress}
      >
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.image} />
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </Pressable>

      <Pressable
        style={styles.addButton}
        onPress={onAddPress}
        disabled={!onAddPress}
      >
        <Ionicons
          name={
            isAdded
              ? "checkmark-done-outline"
              : isSelected
                ? "checkmark-circle"
                : "add-outline"
          }
          size={20}
          color={t.colors.primary}
        />
      </Pressable>
    </View>
  );
}
