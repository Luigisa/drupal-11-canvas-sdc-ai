/**
 * @file
 * Cliente HTTP global para PokéAPI (https://pokeapi.co/).
 */

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export type PokemonRequestInit = {
  readonly signal?: AbortSignal;
};

export type PokemonApiClient = {
  getPokemonByName: (
    name: string,
    init?: PokemonRequestInit,
  ) => Promise<unknown>;
};

function createPokemonApiClient(baseUrl: string): PokemonApiClient {
  return {
    async getPokemonByName(
      name: string,
      init?: PokemonRequestInit,
    ): Promise<unknown> {
      const url = `${baseUrl}/pokemon/${encodeURIComponent(name)}`;
      const response = await fetch(url, { signal: init?.signal });
      if (!response.ok) {
        throw new Error(
          `PokéAPI ${response.status} ${response.statusText}: ${url}`,
        );
      }
      return response.json() as Promise<unknown>;
    },
  };
}

/**
 * Instancia única reutilizable desde behaviors / otros módulos del theme.
 */
export const pokemonApiClient: PokemonApiClient =
  createPokemonApiClient(POKEAPI_BASE_URL);
