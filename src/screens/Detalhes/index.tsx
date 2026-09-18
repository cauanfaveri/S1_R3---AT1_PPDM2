import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePokemonMatches } from "../../context/PokemonMatches";
import { getPokemonByUrl } from "../../services/api";
import { colors, labelize, typeColors } from "../../theme";
import { PokemonDetail, RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Detalhes">;

export default function Detalhes({ route, navigation }: Props) {
  const { name, url } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { isMatched, toggleMatch } = usePokemonMatches();
  const load = useCallback(async () => { try { setLoading(true); setPokemon(await getPokemonByUrl(url)); } finally { setLoading(false); } }, [url]);
  useEffect(() => { navigation.setOptions({ title: labelize(name) }); void load(); }, [load, name, navigation]);

  if (loading) return <View style={styles.state}><ActivityIndicator color={colors.pink} size="large" /></View>;
  if (!pokemon) return <View style={styles.state}><Text style={styles.fail}>Perfil indisponível.</Text><Pressable onPress={() => void load()}><Text style={styles.retry}>Tentar novamente</Text></Pressable></View>;
  const image = pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default;
  const matched = isMatched(pokemon.id);
  const accent = typeColors[pokemon.types[0]?.type.name] ?? colors.pink;
  return <SafeAreaView style={styles.safe} edges={["bottom"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={[styles.imagePanel, { backgroundColor: `${accent}35` }]}>{image && <Image style={styles.image} source={{ uri: image }} />}</View>
    <View style={styles.profileHeader}><View><Text style={styles.name}>{labelize(pokemon.name)} <Text style={styles.id}>#{String(pokemon.id).padStart(3, "0")}</Text></Text><Text style={styles.online}>● Pronto para uma aventura</Text></View><Pressable onPress={() => toggleMatch(pokemon)} style={[styles.heart, matched && styles.heartActive]}><Text style={[styles.heartText, matched && styles.heartTextActive]}>{matched ? "♥" : "♡"}</Text></Pressable></View>
    <View style={styles.types}>{pokemon.types.map(({ type }) => <View key={type.name} style={[styles.type, { backgroundColor: typeColors[type.name] ?? colors.pink }]}><Text style={styles.typeText}>{labelize(type.name)}</Text></View>)}</View>
    <Section title="Sobre mim"><Text style={styles.about}>Tenho {pokemon.height / 10} m, peso {pokemon.weight / 10} kg e adoro desafios. Minha experiência base é {pokemon.base_experience}.</Text></Section>
    <Section title="Minha vibe"><View style={styles.traits}><Trait emoji="⚡" label="Aventureiro" /><Trait emoji="✦" label="Determinado" /><Trait emoji="◉" label="Leal" /></View></Section>
    <Section title="Pontos fortes">{pokemon.stats.slice(0, 4).map(({ stat, base_stat }) => <View key={stat.name} style={styles.stat}><View style={styles.statTop}><Text style={styles.statLabel}>{labelize(stat.name)}</Text><Text style={styles.statNumber}>{base_stat}</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${Math.min(100, base_stat / 1.8)}%`, backgroundColor: accent }]} /></View></View>)}</Section>
    <Pressable onPress={() => toggleMatch(pokemon)} style={[styles.matchButton, matched && styles.matchButtonActive]}><Text style={styles.matchButtonText}>{matched ? "♥ DESFAZER MATCH" : "♥ DAR MATCH"}</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

function Section({ title, children }: { title: string; children: ReactNode }) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function Trait({ emoji, label }: { emoji: string; label: string }) { return <View style={styles.trait}><Text>{emoji}</Text><Text style={styles.traitText}>{label}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background }, content: { padding: 20, paddingBottom: 36 }, state: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }, fail: { color: colors.text, fontWeight: "800" }, retry: { color: colors.pink, fontWeight: "900", marginTop: 15 }, imagePanel: { height: 280, borderRadius: 26, alignItems: "center", justifyContent: "center", overflow: "hidden" }, image: { width: 258, height: 258 }, profileHeader: { marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, name: { color: colors.text, fontSize: 26, fontWeight: "900", letterSpacing: -0.7 }, id: { color: colors.muted, fontSize: 16, fontWeight: "600" }, online: { color: colors.green, marginTop: 5, fontWeight: "700", fontSize: 12 }, heart: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.pinkSoft, alignItems: "center", justifyContent: "center" }, heartActive: { backgroundColor: colors.pink }, heartText: { color: colors.pink, fontSize: 31, lineHeight: 35 }, heartTextActive: { color: "#FFF" }, types: { flexDirection: "row", gap: 7, marginTop: 15 }, type: { borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 }, typeText: { color: "#FFF", fontSize: 11, fontWeight: "900" }, section: { backgroundColor: colors.surface, borderRadius: 19, padding: 17, marginTop: 15 }, sectionTitle: { color: colors.text, fontSize: 16, fontWeight: "900", marginBottom: 11 }, about: { color: colors.muted, fontSize: 14, lineHeight: 20 }, traits: { flexDirection: "row", gap: 8 }, trait: { flex: 1, backgroundColor: colors.background, borderRadius: 12, paddingVertical: 11, alignItems: "center", gap: 5 }, traitText: { color: colors.text, fontSize: 10, fontWeight: "800" }, stat: { marginBottom: 12 }, statTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }, statLabel: { color: colors.muted, fontSize: 12 }, statNumber: { color: colors.text, fontWeight: "900", fontSize: 12 }, track: { height: 7, backgroundColor: colors.border, borderRadius: 4, overflow: "hidden" }, fill: { height: "100%", borderRadius: 4 }, matchButton: { marginTop: 22, alignItems: "center", backgroundColor: colors.pink, borderRadius: 24, paddingVertical: 15 }, matchButtonActive: { backgroundColor: colors.dark }, matchButtonText: { color: "#FFF", fontWeight: "900", fontSize: 12, letterSpacing: 0.7 },
});
