import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Image, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePokemonMatches } from "../../context/PokemonMatches";
import { getPokemonByName, getPokemonUrl } from "../../services/api";
import { colors, labelize, typeColors } from "../../theme";
import { PokemonDetail, RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;
const deck = [25, 6, 7, 133, 143, 94, 150, 131, 149, 448, 282, 658];
const { width: screenWidth } = Dimensions.get("window");
const swipeThreshold = screenWidth * 0.28;

export default function Home({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [matchCelebration, setMatchCelebration] = useState<PokemonDetail | null>(null);
  const { matches, toggleMatch } = usePokemonMatches();
  const position = useRef(new Animated.ValueXY()).current;
  const matchScale = useRef(new Animated.Value(0.4)).current;
  const matchOpacity = useRef(new Animated.Value(0)).current;

  const loadPokemon = useCallback(async () => {
    setLoading(true);
    try {
      setPokemon(await getPokemonByName(String(deck[index % deck.length])));
    } catch {
      setPokemon(null);
      setNotice("Nao foi possivel encontrar um Pokemon agora.");
    } finally {
      setLoading(false);
    }
  }, [index]);

  useEffect(() => { void loadPokemon(); }, [loadPokemon]);

  useEffect(() => {
    if (!matchCelebration) return;

    matchScale.setValue(0.4);
    matchOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(matchScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: false }),
      Animated.timing(matchOpacity, { toValue: 1, duration: 180, useNativeDriver: false }),
    ]).start();

    const timer = setTimeout(() => setMatchCelebration(null), 1800);
    return () => clearTimeout(timer);
  }, [matchCelebration, matchOpacity, matchScale]);

  const completeReaction = useCallback((direction: "left" | "right", superLike = false) => {
    if (!pokemon) return;
    if (direction === "right") {
      toggleMatch(pokemon);
      setMatchCelebration(pokemon);
      setNotice(superLike ? "Super match!" : `${labelize(pokemon.name)} curtiu voce tambem!`);
    } else {
      setNotice(null);
    }
    position.setValue({ x: 0, y: 0 });
    setIndex((current) => current + 1);
  }, [pokemon, position, toggleMatch]);

  const swipe = useCallback((direction: "left" | "right", superLike = false) => {
    if (!pokemon || loading) return;
    Animated.timing(position, {
      toValue: { x: direction === "right" ? screenWidth * 1.35 : -screenWidth * 1.35, y: 20 },
      duration: 240,
      useNativeDriver: false,
    }).start(() => completeReaction(direction, superLike));
  }, [completeReaction, loading, pokemon, position]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 4,
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > swipeThreshold) swipe("right");
      else if (gesture.dx < -swipeThreshold) swipe("left");
      else Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 6, tension: 75, useNativeDriver: false }).start();
    },
    onPanResponderTerminate: () => Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(),
  }), [position, swipe]);

  const rotation = position.x.interpolate({ inputRange: [-screenWidth, 0, screenWidth], outputRange: ["-14deg", "0deg", "14deg"], extrapolate: "clamp" });
  const likeOpacity = position.x.interpolate({ inputRange: [0, swipeThreshold * 0.45, swipeThreshold], outputRange: [0, 0.55, 1], extrapolate: "clamp" });
  const nopeOpacity = position.x.interpolate({ inputRange: [-swipeThreshold, -swipeThreshold * 0.45, 0], outputRange: [1, 0.55, 0], extrapolate: "clamp" });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View style={styles.brand}><Text style={styles.flame}>♥</Text><Text style={styles.logo}>PokeMatch</Text></View>
        <Pressable onPress={() => navigation.navigate("Lista")} style={styles.matchLink}><Text style={styles.matchCount}>{matches.length}</Text><Text style={styles.matchIcon}>◇</Text></Pressable>
      </View>

      <View style={styles.deckArea}>
        <View style={styles.backCard} />
        {loading ? <View style={styles.card}><ActivityIndicator size="large" color={colors.pink} /></View> : pokemon ? (
          <Animated.View {...panResponder.panHandlers} style={[styles.animatedCard, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotation }] }]}>
            <PokemonCard pokemon={pokemon} onPress={() => navigation.navigate("Detalhes", { name: pokemon.name, url: getPokemonUrl(pokemon.id) })} />
            <Animated.View pointerEvents="none" style={[styles.swipeLabel, styles.likeLabel, { opacity: likeOpacity }]}><Text style={styles.likeLabelText}>CURTIR</Text></Animated.View>
            <Animated.View pointerEvents="none" style={[styles.swipeLabel, styles.nopeLabel, { opacity: nopeOpacity }]}><Text style={styles.nopeLabelText}>PASSAR</Text></Animated.View>
          </Animated.View>
        ) : <View style={styles.card}><Text style={styles.emptyTitle}>Ops...</Text><Text style={styles.emptyText}>{notice}</Text><Pressable onPress={() => void loadPokemon()}><Text style={styles.retry}>Tentar de novo</Text></Pressable></View>}
      </View>

      <Text style={styles.hint}>Arraste para a direita para curtir ou esquerda para passar</Text>
      <View style={styles.actions}><Action label="×" color={colors.pink} size="large" onPress={() => swipe("left")} /><Action label="★" color={colors.blue} onPress={() => swipe("right", true)} /><Action label="♥" color={colors.green} size="large" onPress={() => swipe("right")} /></View>
      {notice && <View style={styles.toast}><Text style={styles.toastText}>{notice}</Text></View>}
      <Pressable style={styles.matchesButton} onPress={() => navigation.navigate("Lista")}><Text style={styles.matchesText}>VER MEUS MATCHES</Text></Pressable>
      {matchCelebration && <MatchCelebration pokemon={matchCelebration} opacity={matchOpacity} scale={matchScale} onDismiss={() => setMatchCelebration(null)} />}
    </SafeAreaView>
  );
}

function PokemonCard({ pokemon, onPress }: { pokemon: PokemonDetail; onPress: () => void }) {
  const image = pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default;
  const mainType = pokemon.types[0]?.type.name ?? "normal";
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.cardGlow, { backgroundColor: typeColors[mainType] ?? colors.pink }]} />
      {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
      <View style={styles.gradient}>
        <Text style={styles.name}>{labelize(pokemon.name)} <Text style={styles.number}>#{String(pokemon.id).padStart(3, "0")}</Text></Text>
        <Text style={styles.bio}>Procurando uma aventura inesquecivel.</Text>
        <View style={styles.tags}>
          {pokemon.types.map(({ type }) => (
            <View style={styles.tag} key={type.name}>
              <Text style={styles.tagText}>{labelize(type.name)}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

function Action({ label, color, onPress, size }: { label: string; color: string; onPress: () => void; size?: "large" }) { return <Pressable onPress={onPress} style={[styles.action, size === "large" && styles.actionLarge, { borderColor: `${color}44` }]}><Text style={[styles.actionText, size === "large" && styles.actionTextLarge, { color }]}>{label}</Text></Pressable>; }

function MatchCelebration({ pokemon, opacity, scale, onDismiss }: { pokemon: PokemonDetail; opacity: Animated.Value; scale: Animated.Value; onDismiss: () => void }) {
  const image = pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default;
  return <Pressable style={styles.matchOverlay} onPress={onDismiss}>
    <Animated.View style={[styles.matchPanel, { opacity, transform: [{ scale }] }]}>
      <View style={styles.sparkleOne} /><View style={styles.sparkleTwo} /><View style={styles.sparkleThree} />
      <Text style={styles.matchTitle}>E UM MATCH!</Text>
      <Text style={styles.matchSubtitle}>Voce e {labelize(pokemon.name)} combinaram.</Text>
      <View style={styles.matchImageFrame}>{image && <Image source={{ uri: image }} style={styles.matchImage} />}</View>
      <Text style={styles.matchDismiss}>TOQUE PARA CONTINUAR</Text>
    </Animated.View>
  </Pressable>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }, header: { height: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, brand: { flexDirection: "row", alignItems: "center", gap: 7 }, flame: { color: colors.pink, fontSize: 26 }, logo: { color: colors.text, fontSize: 21, fontWeight: "900", letterSpacing: -0.6 }, matchLink: { height: 40, minWidth: 42, backgroundColor: colors.pinkSoft, borderRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }, matchCount: { color: colors.pink, fontWeight: "900", marginRight: 4 }, matchIcon: { color: colors.pink, fontSize: 21 }, deckArea: { flex: 1, minHeight: 390, justifyContent: "center" }, backCard: { position: "absolute", backgroundColor: "#EDEEF2", borderRadius: 26, height: "90%", width: "94%", alignSelf: "center", transform: [{ translateY: 10 }] }, animatedCard: { height: "94%", minHeight: 390 }, card: { height: "100%", minHeight: 390, backgroundColor: colors.surface, borderRadius: 26, overflow: "hidden", elevation: 7, shadowColor: "#222", shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, alignItems: "center", justifyContent: "center" }, cardGlow: { position: "absolute", top: -70, width: 360, height: 300, borderRadius: 180, opacity: 0.25 }, image: { width: "92%", height: "73%", marginTop: -42 }, gradient: { position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 146, padding: 20, justifyContent: "flex-end", backgroundColor: "#17171CEB" }, name: { color: "#FFF", fontSize: 29, fontWeight: "900", letterSpacing: -0.8 }, number: { color: "#C2C3CB", fontSize: 17, fontWeight: "600" }, bio: { color: "#D5D6DD", fontSize: 13, marginTop: 5 }, tags: { flexDirection: "row", gap: 6, marginTop: 12 }, tag: { backgroundColor: "#FFFFFF2A", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }, tagText: { color: "#FFF", fontSize: 11, fontWeight: "800" }, swipeLabel: { position: "absolute", top: 34, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 3, borderRadius: 6, transform: [{ rotate: "-10deg" }] }, likeLabel: { left: 23, borderColor: colors.green }, nopeLabel: { right: 23, borderColor: colors.pink, transform: [{ rotate: "10deg" }] }, likeLabelText: { color: colors.green, fontSize: 22, fontWeight: "900" }, nopeLabelText: { color: colors.pink, fontSize: 22, fontWeight: "900" }, hint: { color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 4 }, actions: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 23, marginVertical: 18 }, action: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, alignItems: "center", justifyContent: "center", elevation: 2 }, actionLarge: { width: 64, height: 64, borderRadius: 32 }, actionText: { fontSize: 29, fontWeight: "500", lineHeight: 33 }, actionTextLarge: { fontSize: 35 }, toast: { alignSelf: "center", position: "absolute", bottom: 94, backgroundColor: colors.dark, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 18 }, toastText: { color: "#FFF", fontSize: 12, fontWeight: "700" }, matchesButton: { alignSelf: "center", paddingBottom: 10 }, matchesText: { color: colors.pink, fontSize: 12, fontWeight: "900", letterSpacing: 0.8 }, emptyTitle: { color: colors.text, fontWeight: "900", fontSize: 23 }, emptyText: { color: colors.muted, marginTop: 8, textAlign: "center", paddingHorizontal: 24 }, retry: { color: colors.pink, marginTop: 20, fontWeight: "900" }, matchOverlay: { position: "absolute", zIndex: 20, left: -20, right: -20, top: 0, bottom: 0, backgroundColor: "#FD5068F2", alignItems: "center", justifyContent: "center", padding: 28 }, matchPanel: { width: "100%", alignItems: "center" }, matchTitle: { color: "#FFF", fontSize: 32, fontWeight: "900", letterSpacing: 1 }, matchSubtitle: { color: "#FFE8EC", fontSize: 15, marginTop: 8, textAlign: "center" }, matchImageFrame: { width: 190, height: 190, borderRadius: 95, marginTop: 26, backgroundColor: "#FFFFFF2E", borderWidth: 5, borderColor: "#FFFFFF99", alignItems: "center", justifyContent: "center" }, matchImage: { width: 174, height: 174 }, matchDismiss: { marginTop: 30, color: "#FFF", fontWeight: "900", fontSize: 11, letterSpacing: 1 }, sparkleOne: { position: "absolute", width: 16, height: 16, borderRadius: 8, backgroundColor: "#FFF", top: 10, left: 45 }, sparkleTwo: { position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: "#FFE58B", top: 104, right: 48 }, sparkleThree: { position: "absolute", width: 13, height: 13, borderRadius: 7, backgroundColor: "#FFF", bottom: 20, left: 56 },
});
