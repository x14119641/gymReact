import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { getAPIErrorMessage } from "@/src/services/errors";

export default function Register() {
    const t = useTheme();
    const router = useRouter();

    const doRegister = useAuth((s) => s.doRegister);
    const doLogin = useAuth((s) => s.doLogin);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    async function onsubmit() {
        setLoading(true);
        setErr(null);
        try {
            await doRegister(email,username, password);
            // router.replace("/(auth)/onboarding");
        } catch (e:any) {
            console.log(e);
            setErr(getAPIErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[s.wrap, { backgroundColor: t.colors.bg }]}>
            <Text style={[s.title, {color:t.colors.text}]}>Create Account</Text>

            <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
                style={[s.input, {color:t.colors.text, borderColor:t.colors.border, backgroundColor:t.colors.card}]}
                placeholderTextColor={t.colors.subtext}
            />

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={[s.input, {color:t.colors.text, borderColor:t.colors.border, backgroundColor:t.colors.card}]}
                placeholderTextColor={t.colors.subtext}
            />

            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={[s.input, {color:t.colors.text, borderColor:t.colors.border, backgroundColor:t.colors.card}]}
                placeholderTextColor={t.colors.subtext}
            />
            

            <Button title={loading ? "..." : "Register"} onPress={onsubmit} />

            {err ? <Text style={{color:t.colors.error,  paddingTop:2, textAlign:"center"}}>{err}</Text> : null}

        </View>
    )
}

const s = StyleSheet.create({
    wrap : {flex:1, justifyContent:"center", padding:16},
    title: {fontSize:22, fontWeight:"700", marginBottom:16, textAlign:"center"},
    input: {borderWidth:1, borderRadius:10, paddingHorizontal: 12, paddingVertical:10, marginBottom:12}
})