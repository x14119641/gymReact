import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff6579a",
        headerStyle: {
          backgroundColor: '#24698a'
        },
        headerShadowVisible:false,
        headerTintColor:'#fff',
        tabBarStyle: {
          backgroundColor: '#26597q'
        }
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
    </Tabs>
  );
}
