import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getPokemons, getSpriteUrl, extractId } from "../../services/api";
import { PokemonListItem, RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export default function Lista({ navigation }: Props) {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      const data = await getPokemons(60, 0);
      setPokemons(data.results);
    } catch (e) {
      setErro("Não foi possível carregar os dados. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const dadosFiltrados = pokemons.filter((p) =>
    p.name.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={styles.info}>Carregando pokémons...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>{erro}</Text>
        <TouchableOpacity style={styles.retry} onPress={carregar}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar pokémon..."
        placeholderTextColor="#9E9E9E"
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ padding: 16, paddingTop: 4 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={styles.info}>Nenhum pokémon encontrado.</Text>
        }
        renderItem={({ item }) => {
          const id = extractId(item.url);
          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Detalhes", {
                  name: item.name,
                  url: item.url,
                })
              }
            >
              <Image source={{ uri: getSpriteUrl(id) }} style={styles.sprite} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nome}>{item.name}</Text>
                <Text style={styles.id}>#{String(id).padStart(3, "0")}</Text>
              </View>
              <Text style={styles.seta}>›</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F5F5",
  },
  input: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    color: "#212121",
    elevation: 2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  sprite: { width: 56, height: 56, marginRight: 14 },
  nome: {
    fontSize: 17,
    fontWeight: "600",
    color: "#212121",
    textTransform: "capitalize",
  },
  id: { fontSize: 13, color: "#9E9E9E", marginTop: 2 },
  seta: { fontSize: 28, color: "#BDBDBD", paddingHorizontal: 6 },
  info: { marginTop: 12, color: "#616161", textAlign: "center" },
  erro: { color: "#D32F2F", fontSize: 15, textAlign: "center" },
  retry: {
    marginTop: 16,
    backgroundColor: "#D32F2F",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  retryText: { color: "#FFFFFF", fontWeight: "bold" },
});
