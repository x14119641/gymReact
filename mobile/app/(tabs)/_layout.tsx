import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function RootTabs() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff6579a",
        headerStyle: {
          backgroundColor: t.colors.card
        },
        headerShadowVisible:false,
        headerTintColor:'#fff',
        tabBarStyle: {
          backgroundColor: t.colors.accent
        },
        headerShown:false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            ></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={24}
            ></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="newPage"
        options={{
          title: "NewPage",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "airplane" : "airplane-outline"
              }
              color={color}
              size={24}
            ></Ionicons>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused ? "settings" : "settings-outline"
              }
              color={color}
              size={24}
            ></Ionicons>
          ),
        }}
      />
    </Tabs>
  );
}
