import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/Home";
import Lista from "./src/screens/Lista";
import Detalhes from "./src/screens/Detalhes";
import { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#D32F2F" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#F5F5F5" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Pokédex Mobile" }}
        />
        <Stack.Screen
          name="Lista"
          component={Lista}
          options={{ title: "Pokémons" }}
        />
        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
          options={{ title: "Detalhes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
