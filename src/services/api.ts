import { PokemonDetail, PokemonListResponse } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Busca a lista de pokémons (nome + url de detalhe).
 */
export async function getPokemons(limit = 50, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar a lista de pokémons (${response.status})`);
  }

  return response.json();
}

/**
 * Busca os detalhes de um pokémon a partir da URL retornada na listagem.
 */
export async function getPokemonByUrl(url: string): Promise<PokemonDetail> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar os detalhes do pokémon (${response.status})`);
  }

  return response.json();
}

/**
 * Monta a URL da imagem a partir do ID (evita uma requisição extra na listagem).
 */
export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Extrai o ID do pokémon da URL: .../pokemon/25/ -> 25
 */
export function extractId(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}
