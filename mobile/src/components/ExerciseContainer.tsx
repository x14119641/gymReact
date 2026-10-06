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

type ExerciseContainerProps = {
  image?: ImageSourcePropType;
  title: string;
  summary: string;
  onOptionsPress?: () => void;
};

export function ExerciseContainer({
  image,
  title,
  summary,
  onOptionsPress,
}: ExerciseContainerProps) {
  const t = useTheme();

  const styles = useMemo(() => {
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
        flexDirection: "row",
        alignItems: "center",
        gap: 12,

        backgroundColor: t.colors.surface,
        borderColor: t.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,

        ...shadow,
      },
      image: {
        width: 72,
        height: 72,
        borderRadius: 10,
        backgroundColor: t.colors.surfaceSecondary,
        borderWidth: 1,
        borderColor: t.colors.border,
      },
      info: {
        flex: 1,
        gap: 4,
      },
      title: {
        color: t.colors.text,
        fontSize: 16,
        fontWeight: "700",
      },

      summary: {
        color: t.colors.textMuted,
        fontSize: 14,
      },

      optionsButton: {
        alignSelf: "flex-start",
        padding: 4,
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
        <Text style={styles.summary}>{summary}</Text>
      </View>

      <Pressable
        style={styles.optionsButton}
        onPress={onOptionsPress}
        disabled={!onOptionsPress}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={t.colors.textMuted}
        />
      </Pressable>
    </View>
  );
}
