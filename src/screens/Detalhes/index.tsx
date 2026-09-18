import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getPokemonByUrl } from "../../services/api";
import { PokemonDetail, RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhes">;

export default function Detalhes({ route, navigation }: Props) {
  const { name, url } = route.params;

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: name.toUpperCase() });

    (async () => {
      try {
        const data = await getPokemonByUrl(url);
        setPokemon(data);
      } catch (e) {
        setErro("Não foi possível carregar os detalhes.");
      } finally {
        setLoading(false);
      }
    })();
  }, [name, url, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  if (erro || !pokemon) {
    return (
      <View style={styles.center}>
        <Text style={styles.erro}>{erro}</Text>
      </View>
    );
  }

  const imagem =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default ??
    undefined;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {imagem && <Image source={{ uri: imagem }} style={styles.imagem} />}
        <Text style={styles.nome}>{pokemon.name}</Text>
        <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text>

        <View style={styles.tipos}>
          {pokemon.types.map((t) => (
            <View key={t.type.name} style={styles.tipo}>
              <Text style={styles.tipoText}>{t.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Informações gerais</Text>
        <Linha label="Altura" valor={`${pokemon.height / 10} m`} />
        <Linha label="Peso" valor={`${pokemon.weight / 10} kg`} />
        <Linha label="Experiência base" valor={`${pokemon.base_experience}`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Habilidades</Text>
        {pokemon.abilities.map((a) => (
          <Linha
            key={a.ability.name}
            label={a.ability.name}
            valor={a.is_hidden ? "Oculta" : "Normal"}
          />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Status base</Text>
        {pokemon.stats.map((s) => (
          <View key={s.stat.name} style={{ marginBottom: 10 }}>
            <Linha label={s.stat.name} valor={`${s.base_stat}`} />
            <View style={styles.barraFundo}>
              <View
                style={[
                  styles.barra,
                  { width: `${Math.min(s.base_stat, 150) / 1.5}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#F5F5F5" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  header: { alignItems: "center", marginBottom: 16 },
  imagem: { width: 200, height: 200 },
  nome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#212121",
    textTransform: "capitalize",
  },
  id: { fontSize: 14, color: "#9E9E9E", marginBottom: 10 },
  tipos: { flexDirection: "row", gap: 8 },
  tipo: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  tipoText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 10,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  linhaLabel: { color: "#616161", textTransform: "capitalize" },
  linhaValor: { color: "#212121", fontWeight: "600" },
  barraFundo: {
    height: 6,
    backgroundColor: "#EEEEEE",
    borderRadius: 3,
    overflow: "hidden",
  },
  barra: { height: 6, backgroundColor: "#D32F2F" },
  erro: { color: "#D32F2F", fontSize: 15 },
});
