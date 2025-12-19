import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";
import { getAPIErrorMessage } from "@/src/services/errors";

export default function Login() {
  console.log("LOGIN RENDER");
  const t = useTheme();
  const router = useRouter();
  const doLogin = useAuth(s => s.doLogin);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onsubmit() {
    setLoading(true);
    setErr(null);
    if (!identifier) {
      setErr("Identifier missing");
      return;
    }
    try {
      await doLogin(identifier, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log(e);
      setErr(getAPIErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function onRegister() {
    setLoading(true);
    setErr(null);
    try {
      router.replace("/(auth)/register");
    } catch (e: any) {
      console.log(e);
      setErr(getAPIErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[s.wrap, { backgroundColor: t.colors.bg }]}>
      <Text style={[s.title, { color: t.colors.text }]}>Sign in Here</Text>
      <TextInput
        value={identifier}
        onChangeText={setIdentifier}
        placeholder="USername or Email"
        autoCapitalize="none"
        style={[
          s.input,
          {
            color: t.colors.text,
            borderColor: t.colors.border,
            backgroundColor: t.colors.card,
          },
        ]}
        placeholderTextColor={t.colors.subtext}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={[
          s.input,
          {
            color: t.colors.text,
            borderColor: t.colors.border,
            backgroundColor: t.colors.card,
          },
        ]}
        placeholderTextColor={t.colors.subtext}
      />
      
      <Button title={loading ? "..." : "Login"} onPress={onsubmit} />
      <Text style={{ color: t.colors.subtext, paddingTop: 8, textAlign:"center" }}>Not registered? <Text style={{ color: t.colors.accent}} onPress={onRegister}>click here!</Text></Text>
        
      {err ? (
        <Text style={{ color: t.colors.error, paddingTop: 8, textAlign:"center" }}>{err}</Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
});





