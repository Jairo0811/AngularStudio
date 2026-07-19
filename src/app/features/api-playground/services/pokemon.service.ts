import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import {
  EvolutionChainLink, EvolutionChainResponse, EvolutionDetail, EvolutionNodeViewModel,
  Pokemon, PokemonAbilityDetails, PokemonAbilityViewModel, PokemonAdvancedDetail,
  PokemonCardViewModel, PokemonEncounter, PokemonEncounterViewModel, PokemonFormCategory,
  PokemonListResponse, PokemonPage, PokemonSpecies, PokemonSpriteOption,
  PokemonTypeDetails, TypeEffectiveness, TypeMultiplier,
} from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = 'https://pokeapi.co/api/v2';
  private readonly nationalPokedexMaxId = 1025;

  private readonly pokemonIndex$ = this.http.get<PokemonListResponse>(`${this.endpoint}/pokemon`, {
    params: new HttpParams().set('limit', '10000').set('offset', '0'),
  }).pipe(map((response) => response.results), shareReplay({ bufferSize: 1, refCount: false }));

  getPokemon(identifier: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.endpoint}/pokemon/${this.normalize(identifier)}`);
  }

  getPokemonPage(
    category: PokemonFormCategory,
    limit = 20,
    offset = 0,
    startId?: number,
    endId?: number,
  ): Observable<PokemonPage> {
    return this.pokemonIndex$.pipe(
      map((index) =>
        index.filter((item) => {
          const pokemonId = this.extractId(item.url);
          const matchesCategory =
            category === 'all'
            || this.getIndexCategory(item.name, pokemonId) === category;

          const matchesStart = startId === undefined || pokemonId >= startId;
          const matchesEnd = endId === undefined || pokemonId <= endId;

          return matchesCategory && matchesStart && matchesEnd;
        }),
      ),
      switchMap((filtered) => {
        const page = filtered.slice(offset, offset + limit);

        if (page.length === 0) {
          return of({ count: filtered.length, items: [] });
        }

        return forkJoin(page.map((item) => this.getPokemon(item.name))).pipe(
          map((items) => ({
            count: filtered.length,
            items: items.map((item) => this.toCardViewModel(item)),
          })),
        );
      }),
    );
  }

  getAdvancedDetail(identifier: string | number): Observable<PokemonAdvancedDetail> {
    return this.getPokemon(identifier).pipe(
      switchMap((pokemon) => forkJoin({
        species: this.http.get<PokemonSpecies>(pokemon.species.url),
        abilities: forkJoin(pokemon.abilities.map((slot) => this.http.get<PokemonAbilityDetails>(slot.ability.url))).pipe(catchError(() => of([]))),
        types: forkJoin(pokemon.types.map((slot) => this.http.get<PokemonTypeDetails>(slot.type.url))).pipe(catchError(() => of([]))),
        encounters: this.http.get<PokemonEncounter[]>(pokemon.location_area_encounters).pipe(catchError(() => of([]))),
      }).pipe(
        switchMap((base) => forkJoin({
          varieties: base.species.varieties.length
            ? forkJoin(base.species.varieties.map((variety) => this.getPokemon(variety.pokemon.name))).pipe(map((items) => items.map((item) => this.toCardViewModel(item))))
            : of([]),
          evolution: base.species.evolution_chain
            ? this.http.get<EvolutionChainResponse>(base.species.evolution_chain.url).pipe(map((chain) => this.mapEvolutionNode(chain.chain)), catchError(() => of(null)))
            : of(null),
        }).pipe(map((extra) => ({
          pokemon,
          species: base.species,
          varieties: extra.varieties,
          abilities: this.mapAbilities(pokemon, base.abilities),
          effectiveness: this.calculateEffectiveness(base.types),
          evolution: extra.evolution,
          encounters: this.mapEncounters(base.encounters),
          sprites: this.mapSprites(pokemon),
        })))),
      )),
    );
  }

  getFormCategory(name: string): PokemonFormCategory {
    const tokens = name.toLowerCase().split('-');

    if (tokens.includes('alola')) return 'alola';
    if (tokens.includes('galar')) return 'galar';
    if (tokens.includes('hisui')) return 'hisui';
    if (tokens.includes('paldea')) return 'paldea';
    if (tokens.includes('mega')) return 'mega';
    if (tokens.includes('gmax') || tokens.includes('eternamax')) return 'dynamax';
    if (tokens.includes('primal')) return 'primal';
    if (tokens.includes('totem')) return 'totem';

    return 'default';
  }

  getFormLabel(category: PokemonFormCategory): string {
    return ({ all: 'Todas las formas', default: 'Forma normal', alola: 'Forma de Alola', galar: 'Forma de Galar', hisui: 'Forma de Hisui', paldea: 'Forma de Paldea', mega: 'Megaevolución', dynamax: 'Gigamax / Dinamax', primal: 'Regresión Primigenia', totem: 'Forma Tótem', other: 'Forma alternativa' })[category];
  }

  private getIndexCategory(name: string, pokemonId: number): PokemonFormCategory {
    if (pokemonId > 0 && pokemonId <= this.nationalPokedexMaxId) {
      return 'default';
    }

    const detectedCategory = this.getFormCategory(name);
    return detectedCategory === 'default' ? 'other' : detectedCategory;
  }

  private normalize(value: string | number): string { return String(value).trim().toLowerCase(); }
  private format(value: string): string { return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }

  private toCardViewModel(pokemon: Pokemon): PokemonCardViewModel {
    const detectedCategory = this.getFormCategory(pokemon.name);
    const category: PokemonFormCategory = pokemon.is_default
      ? 'default'
      : detectedCategory === 'default'
        ? 'other'
        : detectedCategory;

    return {
      id: pokemon.id,
      name: pokemon.name,
      displayName: this.format(pokemon.name),
      imageUrl:
        pokemon.sprites.other?.['official-artwork']?.front_default
        ?? pokemon.sprites.other?.home?.front_default
        ?? pokemon.sprites.front_default
        ?? '',
      types: pokemon.types.map((entry) => entry.type.name),
      formCategory: category,
      formLabel: this.getFormLabel(category),
      isDefault: pokemon.is_default,
    };
  }

  private mapAbilities(pokemon: Pokemon, details: PokemonAbilityDetails[]): PokemonAbilityViewModel[] {
    return pokemon.abilities.map((slot) => {
      const detail = details.find((item) => item.name === slot.ability.name);
      const englishEffect = detail?.effect_entries.find((entry) => entry.language.name === 'en')?.short_effect;
      const flavor = detail?.flavor_text_entries.find((entry) => entry.language.name === 'en')?.flavor_text;
      return { name: slot.ability.name, displayName: this.format(slot.ability.name), isHidden: slot.is_hidden, description: (englishEffect ?? flavor ?? 'Descripción no disponible.').replace(/[\n\f]/g, ' ') };
    });
  }

  private calculateEffectiveness(types: PokemonTypeDetails[]): TypeEffectiveness {
    const multipliers = new Map<string, number>();
    for (const type of types) {
      for (const relation of type.damage_relations.double_damage_from) multipliers.set(relation.name, (multipliers.get(relation.name) ?? 1) * 2);
      for (const relation of type.damage_relations.half_damage_from) multipliers.set(relation.name, (multipliers.get(relation.name) ?? 1) * 0.5);
      for (const relation of type.damage_relations.no_damage_from) multipliers.set(relation.name, 0);
    }
    const toList = (predicate: (value: number) => boolean): TypeMultiplier[] => [...multipliers.entries()].filter(([, value]) => predicate(value)).map(([type, multiplier]) => ({ type, multiplier })).sort((a, b) => b.multiplier - a.multiplier || a.type.localeCompare(b.type));
    return { weaknesses: toList((v) => v > 1), resistances: toList((v) => v > 0 && v < 1), immunities: toList((v) => v === 0) };
  }

  private mapEvolutionNode(link: EvolutionChainLink): EvolutionNodeViewModel {
    const id = this.extractId(link.species.url);
    return {
      name: link.species.name,
      displayName: this.format(link.species.name),
      imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      conditions: this.describeEvolution(link.evolution_details),
      children: link.evolves_to.map((child) => this.mapEvolutionNode(child)),
    };
  }

  private describeEvolution(details: EvolutionDetail[]): string[] {
    if (details.length === 0) return [];
    const d = details[0];
    const result: string[] = [this.format(d.trigger.name)];
    if (d.min_level !== null) result.push(`Nivel ${d.min_level}`);
    if (d.item) result.push(`Usar ${this.format(d.item.name)}`);
    if (d.held_item) result.push(`Sosteniendo ${this.format(d.held_item.name)}`);
    if (d.known_move) result.push(`Conoce ${this.format(d.known_move.name)}`);
    if (d.known_move_type) result.push(`Movimiento tipo ${this.format(d.known_move_type.name)}`);
    if (d.location) result.push(`En ${this.format(d.location.name)}`);
    if (d.min_happiness !== null) result.push(`Felicidad ${d.min_happiness}+`);
    if (d.min_affection !== null) result.push(`Afecto ${d.min_affection}+`);
    if (d.min_beauty !== null) result.push(`Belleza ${d.min_beauty}+`);
    if (d.time_of_day) result.push(this.format(d.time_of_day));
    if (d.needs_overworld_rain) result.push('Con lluvia');
    if (d.turn_upside_down) result.push('Consola invertida');
    return result;
  }

  private mapEncounters(encounters: PokemonEncounter[]): PokemonEncounterViewModel[] {
    return encounters.slice(0, 30).map((entry) => ({
      location: this.format(entry.location_area.name),
      versions: entry.version_details.map((detail) => this.format(detail.version.name)),
      chance: Math.max(...entry.version_details.map((detail) => detail.max_chance), 0),
    }));
  }

  private mapSprites(pokemon: Pokemon): PokemonSpriteOption[] {
    const candidates: Array<[string, string, string | null | undefined]> = [
      ['official', 'Artwork oficial', pokemon.sprites.other?.['official-artwork']?.front_default],
      ['official-shiny', 'Artwork shiny', pokemon.sprites.other?.['official-artwork']?.front_shiny],
      ['home', 'HOME', pokemon.sprites.other?.home?.front_default],
      ['home-shiny', 'HOME shiny', pokemon.sprites.other?.home?.front_shiny],
      ['showdown', 'Showdown', pokemon.sprites.other?.showdown?.front_default],
      ['classic', 'Sprite clásico', pokemon.sprites.front_default],
      ['classic-shiny', 'Sprite clásico shiny', pokemon.sprites.front_shiny],
      ['back', 'Vista trasera', pokemon.sprites.back_default],
    ];
    return candidates.filter((item): item is [string, string, string] => Boolean(item[2])).map(([id, label, url]) => ({ id, label, url }));
  }

  private extractId(url: string): number { const match = url.match(/\/(\d+)\/?$/); return match ? Number(match[1]) : 0; }
}