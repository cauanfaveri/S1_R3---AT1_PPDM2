import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../pics/pokeball.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Pokédex Mobile</Text>

        <Text style={styles.description}>
          Aplicativo desenvolvido em React Native com Expo que consome a API
          pública PokéAPI. Consulte a lista de pokémons e toque em um item para
          ver informações detalhadas como tipos, habilidades e status de base.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Lista")}
        >
          <Text style={styles.buttonText}>Ver pokémons</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Fonte dos dados: pokeapi.co</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: { width: 140, height: 140, marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#616161",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#D32F2F",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  footer: { marginTop: 24, fontSize: 12, color: "#9E9E9E" },
});
