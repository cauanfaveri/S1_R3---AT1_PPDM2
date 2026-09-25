export const colors = {
  background: "#F7F7F7",
  surface: "#FFFFFF",
  text: "#222229",
  muted: "#7C7D88",
  border: "#ECECEF",
  pink: "#FD5068",
  pinkSoft: "#FFF0F3",
  blue: "#20B7E7",
  green: "#20C997",
  dark: "#111116",
};

export const typeColors: Record<string, string> = {
  normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
  grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
  ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
  rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
  steel: "#B7B7CE", fairy: "#D685AD",
};

export function labelize(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
