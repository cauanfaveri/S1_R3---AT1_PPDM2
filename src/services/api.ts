import { PokemonDetail, PokemonListResponse } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

async function request<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Falha ao carregar dados (${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export function getPokemons(limit = 60, offset = 0) {
  return request<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`);
}

export function getPokemonByUrl(url: string) {
  return request<PokemonDetail>(url);
}

export function getPokemonByName(name: string) {
  return request<PokemonDetail>(`/pokemon/${name.trim().toLowerCase()}`);
}

export function getPokemonUrl(id: number) {
  return `${BASE_URL}/pokemon/${id}`;
}

export function getSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function extractId(url: string) {
  const id = Number(url.split("/").filter(Boolean).pop());
  return Number.isFinite(id) ? id : 0;
}
