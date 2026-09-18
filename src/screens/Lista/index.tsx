import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePokemonMatches } from "../../context/PokemonMatches";
import { getPokemonUrl } from "../../services/api";
import { colors, labelize, typeColors } from "../../theme";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Lista">;

export default function Lista({ navigation }: Props) {
  const { matches } = usePokemonMatches();
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.hero}><Text style={styles.heroIcon}>♥</Text><View><Text style={styles.title}>Seus matches</Text><Text style={styles.subtitle}>{matches.length === 0 ? "Comece a curtir Pokémons" : `${matches.length} conexão${matches.length === 1 ? "" : "ões"} especial${matches.length === 1 ? "" : "is"}`}</Text></View></View>
    {matches.length === 0 ? <Empty onDiscover={() => navigation.navigate("Home")} /> : <View style={styles.grid}>{matches.map((pokemon) => <MatchCard key={pokemon.id} name={pokemon.name} id={pokemon.id} image={pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default} type={pokemon.types[0]?.type.name ?? "normal"} onPress={() => navigation.navigate("Detalhes", { name: pokemon.name, url: getPokemonUrl(pokemon.id) })} />)}</View>}
    {matches.length > 0 && <Pressable style={styles.discover} onPress={() => navigation.navigate("Home")}><Text style={styles.discoverText}>CONTINUAR DESCOBRINDO</Text></Pressable>}
  </ScrollView></SafeAreaView>;
}

function Empty({ onDiscover }: { onDiscover: () => void }) { return <View style={styles.empty}><View style={styles.emptyHeart}><Text style={styles.emptyHeartText}>♡</Text></View><Text style={styles.emptyTitle}>Ainda sem matches</Text><Text style={styles.emptyText}>Curta Pokémons que combinam com sua próxima aventura. Eles aparecerão aqui.</Text><Pressable style={styles.discover} onPress={onDiscover}><Text style={styles.discoverText}>DESCOBRIR POKÉMONS</Text></Pressable></View>; }
function MatchCard({ name, id, image, type, onPress }: { name: string; id: number; image: string | null; type: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.match}><View style={[styles.imageArea, { backgroundColor: `${typeColors[type] ?? colors.pink}2E` }]}>{image && <Image source={{ uri: image }} style={styles.image} />}</View><View style={styles.matchFooter}><Text style={styles.matchName}>{labelize(name)}</Text><Text style={styles.matchNumber}>#{String(id).padStart(3, "0")}</Text></View></Pressable>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 34 }, hero: { flexDirection: "row", alignItems: "center", marginTop: 4, marginBottom: 27 }, heroIcon: { fontSize: 35, color: colors.pink, marginRight: 12 }, title: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.7 }, subtitle: { color: colors.muted, marginTop: 3, fontSize: 13 }, grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 16 }, match: { width: "47.5%", borderRadius: 19, overflow: "hidden", backgroundColor: colors.surface, elevation: 2 }, imageArea: { height: 152, alignItems: "center", justifyContent: "center" }, image: { width: 135, height: 135 }, matchFooter: { padding: 12 }, matchName: { color: colors.text, fontWeight: "900", fontSize: 15 }, matchNumber: { color: colors.muted, fontSize: 11, marginTop: 3 }, empty: { alignItems: "center", paddingTop: 62, paddingHorizontal: 24 }, emptyHeart: { width: 94, height: 94, borderRadius: 47, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" }, emptyHeartText: { color: colors.pink, fontSize: 57, lineHeight: 62 }, emptyTitle: { color: colors.text, fontSize: 21, fontWeight: "900", marginTop: 20 }, emptyText: { color: colors.muted, textAlign: "center", lineHeight: 20, marginTop: 8 }, discover: { marginTop: 26, backgroundColor: colors.pink, paddingHorizontal: 19, paddingVertical: 14, borderRadius: 22, alignSelf: "center" }, discoverText: { color: "#FFF", fontSize: 11, fontWeight: "900", letterSpacing: 0.6 },
});
