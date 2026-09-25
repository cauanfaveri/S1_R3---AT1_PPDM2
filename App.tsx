import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { PokemonMatchesProvider } from "./src/context/PokemonMatches";
import Detalhes from "./src/screens/Detalhes";
import Home from "./src/screens/Home";
import Lista from "./src/screens/Lista";
import { colors } from "./src/theme";
import { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background } };

export default function App() {
  return (
    <SafeAreaProvider>
      <PokemonMatchesProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: "800" },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Lista" component={Lista} options={{ title: "Explorar Pokémon" }} />
            <Stack.Screen name="Detalhes" component={Detalhes} options={{ title: "Perfil" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PokemonMatchesProvider>
    </SafeAreaProvider>
  );
}
