import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePokemonMatches } from "../../context/PokemonMatches";
import { extractId, getPokemons, getPokemonUrl, getSpriteUrl } from "../../services/api";
import { colors, labelize, typeColors } from "../../theme";
import { PokemonListItem, RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export default function Lista({ navigation }: Props) {
  const { matches } = usePokemonMatches();
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getPokemons(60)
      .then((response) => { if (active) setPokemons(response.results); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.url}
        numColumns={2}
        columnWrapperStyle={styles.pokemonRow}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.heroIcon}>♥</Text>
              <View>
                <Text style={styles.title}>Seus matches</Text>
                <Text style={styles.subtitle}>
                  {matches.length === 0
                    ? "Comece a curtir Pokémon"
                    : `${matches.length} conexão${matches.length === 1 ? "" : "ões"} especial${matches.length === 1 ? "" : "is"}`}
                </Text>
              </View>
            </View>
            {matches.length === 0 ? (
              <Empty onDiscover={() => navigation.navigate("Home")} />
            ) : (
              <View style={styles.grid}>
                {matches.map((pokemon) => (
                  <MatchCard
                    key={pokemon.id}
                    name={pokemon.name}
                    id={pokemon.id}
                    image={pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default}
                    type={pokemon.types[0]?.type.name ?? "normal"}
                    onPress={() => navigation.navigate("Detalhes", { name: pokemon.name, url: getPokemonUrl(pokemon.id) })}
                  />
                ))}
              </View>
            )}
            <Text style={styles.collectionTitle}>Explorar Pokémon</Text>
            <Text style={styles.collectionSubtitle}>Conheça Pokémon da PokéAPI e abra um perfil para saber mais.</Text>
            {loading && <ActivityIndicator style={styles.listState} size="large" color={colors.pink} />}
            {error && (
              <View style={styles.listState}>
                <Text style={styles.emptyText}>Não foi possível carregar a coleção.</Text>
                <Pressable onPress={() => setRetry((current) => current + 1)}>
                  <Text style={styles.retry}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => {
          const id = extractId(item.url);
          return (
            <MatchCard
              name={item.name}
              id={id}
              image={getSpriteUrl(id)}
              type="normal"
              onPress={() => navigation.navigate("Detalhes", { name: item.name, url: item.url })}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

function Empty({ onDiscover }: { onDiscover: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyHeart}><Text style={styles.emptyHeartText}>♡</Text></View>
      <Text style={styles.emptyTitle}>Ainda sem matches</Text>
      <Text style={styles.emptyText}>Curta Pokémon que combinam com sua próxima aventura. Eles aparecerão aqui.</Text>
      <Pressable style={styles.discover} onPress={onDiscover}>
        <Text style={styles.discoverText}>DESCOBRIR POKÉMON</Text>
      </Pressable>
    </View>
  );
}

type MatchCardProps = {
  name: string;
  id: number;
  image: string | null;
  type: string;
  onPress: () => void;
};

function MatchCard({ name, id, image, type, onPress }: MatchCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.match}>
      <View style={[styles.imageArea, { backgroundColor: `${typeColors[type] ?? colors.pink}2E` }]}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <View style={styles.matchFooter}>
        <Text style={styles.matchName}>{labelize(name)}</Text>
        <Text style={styles.matchNumber}>#{String(id).padStart(3, "0")}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pokemonRow: { justifyContent: "space-between", marginBottom: 16 },
  collectionTitle: { color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 32 },
  collectionSubtitle: { color: colors.muted, fontSize: 13, marginTop: 5, marginBottom: 20 },
  listState: { alignItems: "center", marginVertical: 24 },
  retry: { color: colors.pink, fontWeight: "900", marginTop: 14 },
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 34 }, hero: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 27 }, heroIcon: { fontSize: 35, color: colors.pink, marginRight: 12 }, title: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.7 }, subtitle: { color: colors.muted, marginTop: 3, fontSize: 13 }, grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 16 }, match: { width: "47.5%", borderRadius: 19, overflow: "hidden", backgroundColor: colors.surface, elevation: 2 }, imageArea: { height: 152, alignItems: "center", justifyContent: "center" }, image: { width: 135, height: 135 }, matchFooter: { padding: 12 }, matchName: { color: colors.text, fontWeight: "900", fontSize: 15 }, matchNumber: { color: colors.muted, fontSize: 11, marginTop: 3 }, empty: { alignItems: "center", paddingTop: 62, paddingHorizontal: 24 }, emptyHeart: { width: 94, height: 94, borderRadius: 47, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" }, emptyHeartText: { color: colors.pink, fontSize: 57, lineHeight: 62 }, emptyTitle: { color: colors.text, fontSize: 21, fontWeight: "900", marginTop: 20 }, emptyText: { color: colors.muted, textAlign: "center", lineHeight: 20, marginTop: 8 }, discover: { marginTop: 26, backgroundColor: colors.pink, paddingHorizontal: 19, paddingVertical: 14, borderRadius: 22, alignSelf: "center" }, discoverText: { color: "#FFF", fontSize: 11, fontWeight: "900", letterSpacing: 0.6 },
});
