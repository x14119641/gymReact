import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/theme/ThemeProvider";
import { useAuth } from "@/src/store/auth";

export default function Login() {
  console.log("LOGIN RENDER");
  const t = useTheme();
  const router = useRouter();
  const doLogin = useAuth(s => s.doLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onsubmit() {
    setLoading(true);
    setErr(null);
    try {
      await doLogin(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log(e);
      setErr("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[s.wrap, { backgroundColor: t.colors.bg }]}>
      <Text style={[s.title, { color: t.colors.text }]}>Sign in Here</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
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
      {err ? (
        <Text style={{ color: t.colors.error, marginBottom: 8 }}>{err}</Text>
      ) : null}
      <Button title={loading ? "..." : "Login"} onPress={onsubmit} />
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





