import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";


export function SettingRow({
    icon, label, value, right, onPress, danger,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label:string,
    value?:string;
    right?:React.ReactNode;
    onPress? : () => void;
    danger?: boolean;
}) {
    const t = useTheme();
    const content = (
        <View style={s.row}>
            <View style={s.left}>
                <Ionicons name={icon} size={18} style={{color:danger ? t.colors.danger:t.colors.textMuted}} />
                <Text style={[s.label, {color:danger ? t.colors.danger:t.colors.text}]}>{label}</Text>
            </View>

            <View style={s.right}>
                {value ? <Text style={[s.value,{color:t.colors.textMuted}]}>{value}</Text> :null}
                {right ?? null}
                {onPress ? <Ionicons name="chevron-forward" size={18} style={{color:danger ? t.colors.danger : t.colors.textMuted}} />:null}
            </View>
        </View>
    );

    if (!onPress) return content;

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [s.pressable, pressed && s.pressed]}>
            {content}
        </Pressable>
    )
}


const s = StyleSheet.create({
    row: {
        width:"100%",
        paddingVertical:6,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    left:{flexDirection:"row", alignItems:"center", gap:10, flexShrink:1},
    right:{flexDirection:"row", alignItems:"center", gap:10, marginLeft:12},

    label:{fontSize:14, fontWeight:"600"},
    value:{fontWeight:"600", flexShrink:1},

    pressable: {borderRadius:10},
    pressed: {opacity:0.75},
})
