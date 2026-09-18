import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

import { PokemonDetail } from "../types";

type MatchesContextValue = {
  matches: PokemonDetail[];
  isMatched: (id: number) => boolean;
  toggleMatch: (pokemon: PokemonDetail) => void;
};

const MatchesContext = createContext<MatchesContextValue | null>(null);

export function PokemonMatchesProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<PokemonDetail[]>([]);
  const value = useMemo<MatchesContextValue>(() => ({
    matches,
    isMatched: (id) => matches.some((pokemon) => pokemon.id === id),
    toggleMatch: (pokemon) => setMatches((current) => current.some((item) => item.id === pokemon.id)
      ? current.filter((item) => item.id !== pokemon.id)
      : [pokemon, ...current]),
  }), [matches]);

  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
}

export function usePokemonMatches() {
  const context = useContext(MatchesContext);
  if (!context) throw new Error("usePokemonMatches must be used within PokemonMatchesProvider");
  return context;
}
