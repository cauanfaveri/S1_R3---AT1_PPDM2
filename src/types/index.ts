export type RootStackParamList = {
  Home: undefined;
  Lista: { type?: string } | undefined;
  Detalhes: { name: string; url: string };
};

export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type PokemonTypeResponse = {
  pokemon: { pokemon: PokemonListItem }[];
};

export type PokemonType = {
  slot: number;
  type: { name: string };
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: { front_default: string | null };
    };
  };
  types: PokemonType[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
};
