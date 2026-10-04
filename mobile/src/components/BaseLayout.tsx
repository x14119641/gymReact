import { View, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export function BaseLayout({children}:{children:React.ReactNode}) {
    const t = useTheme();

    return (
        <SafeAreaView style={[s.safe, {backgroundColor:t.colors.background}]}>
            <View style={[s.container, {backgroundColor:t.colors.background}]}>
                {children}
            </View>
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    safe: {flex:1},
    container: {flex:1, paddingHorizontal:16, paddingTop:8}
});
