export type PokemonFormCategory =
  | 'all' | 'default' | 'alola' | 'galar' | 'hisui' | 'paldea'
  | 'mega' | 'dynamax' | 'primal' | 'totem' | 'other';

export interface PokemonFormFilterOption { readonly id: PokemonFormCategory; readonly label: string; }
export interface PokemonNamedResource { readonly name: string; readonly url: string; }
export interface PokemonListResponse { readonly count: number; readonly next: string | null; readonly previous: string | null; readonly results: PokemonNamedResource[]; }

export interface Pokemon {
  readonly id: number;
  readonly name: string;
  readonly height: number;
  readonly weight: number;
  readonly base_experience: number | null;
  readonly is_default: boolean;
  readonly order: number;
  readonly abilities: PokemonAbilitySlot[];
  readonly forms: PokemonNamedResource[];
  readonly species: PokemonNamedResource;
  readonly sprites: PokemonSprites;
  readonly stats: PokemonStatSlot[];
  readonly types: PokemonTypeSlot[];
  readonly moves: PokemonMoveSlot[];
  readonly game_indices: PokemonGameIndex[];
  readonly cries?: { readonly latest: string | null; readonly legacy: string | null };
  readonly location_area_encounters: string;
}

export interface PokemonAbilitySlot { readonly ability: PokemonNamedResource; readonly is_hidden: boolean; readonly slot: number; }
export interface PokemonSprites {
  readonly front_default: string | null;
  readonly front_shiny: string | null;
  readonly back_default?: string | null;
  readonly back_shiny?: string | null;
  readonly other?: {
    readonly ['official-artwork']?: { readonly front_default: string | null; readonly front_shiny: string | null };
    readonly home?: { readonly front_default: string | null; readonly front_shiny: string | null };
    readonly showdown?: { readonly front_default: string | null; readonly front_shiny: string | null };
  };
}
export interface PokemonStatSlot { readonly base_stat: number; readonly effort: number; readonly stat: PokemonNamedResource; }
export interface PokemonTypeSlot { readonly slot: number; readonly type: PokemonNamedResource; }
export interface PokemonMoveSlot { readonly move: PokemonNamedResource; readonly version_group_details: readonly PokemonMoveVersionDetail[]; }
export interface PokemonMoveVersionDetail { readonly level_learned_at: number; readonly move_learn_method: PokemonNamedResource; readonly version_group: PokemonNamedResource; }
export interface PokemonGameIndex { readonly game_index: number; readonly version: PokemonNamedResource; }

export interface PokemonCardViewModel {
  readonly id: number; readonly name: string; readonly displayName: string; readonly imageUrl: string;
  readonly types: string[]; readonly formCategory: PokemonFormCategory; readonly formLabel: string; readonly isDefault: boolean;
}
export interface PokemonPage { readonly count: number; readonly items: PokemonCardViewModel[]; }

export interface PokemonSpecies {
  readonly id: number;
  readonly name: string;
  readonly forms_switchable: boolean;
  readonly varieties: PokemonSpeciesVariety[];
  readonly generation: PokemonNamedResource;
  readonly color: PokemonNamedResource;
  readonly shape: PokemonNamedResource;
  readonly habitat: PokemonNamedResource | null;
  readonly gender_rate: number;
  readonly capture_rate: number;
  readonly base_happiness: number;
  readonly is_baby: boolean;
  readonly is_legendary: boolean;
  readonly is_mythical: boolean;
  readonly growth_rate: PokemonNamedResource;
  readonly egg_groups: PokemonNamedResource[];
  readonly genera: readonly { readonly genus: string; readonly language: PokemonNamedResource }[];
  readonly flavor_text_entries: readonly { readonly flavor_text: string; readonly language: PokemonNamedResource; readonly version: PokemonNamedResource }[];
  readonly evolution_chain: { readonly url: string } | null;
}
export interface PokemonSpeciesVariety { readonly is_default: boolean; readonly pokemon: PokemonNamedResource; }

export interface PokemonAbilityDetails {
  readonly id: number;
  readonly name: string;
  readonly effect_entries: readonly { readonly effect: string; readonly short_effect: string; readonly language: PokemonNamedResource }[];
  readonly flavor_text_entries: readonly { readonly flavor_text: string; readonly language: PokemonNamedResource; readonly version_group: PokemonNamedResource }[];
}

export interface PokemonTypeDetails {
  readonly name: string;
  readonly damage_relations: {
    readonly double_damage_from: PokemonNamedResource[];
    readonly half_damage_from: PokemonNamedResource[];
    readonly no_damage_from: PokemonNamedResource[];
  };
}

export interface EvolutionChainResponse { readonly id: number; readonly chain: EvolutionChainLink; }
export interface EvolutionChainLink {
  readonly species: PokemonNamedResource;
  readonly evolution_details: EvolutionDetail[];
  readonly evolves_to: EvolutionChainLink[];
}
export interface EvolutionDetail {
  readonly trigger: PokemonNamedResource;
  readonly min_level: number | null;
  readonly item: PokemonNamedResource | null;
  readonly held_item: PokemonNamedResource | null;
  readonly known_move: PokemonNamedResource | null;
  readonly known_move_type: PokemonNamedResource | null;
  readonly location: PokemonNamedResource | null;
  readonly min_happiness: number | null;
  readonly min_beauty: number | null;
  readonly min_affection: number | null;
  readonly time_of_day: string;
  readonly gender: number | null;
  readonly needs_overworld_rain: boolean;
  readonly turn_upside_down: boolean;
}
export interface EvolutionNodeViewModel {
  readonly name: string;
  readonly displayName: string;
  readonly imageUrl: string;
  readonly conditions: string[];
  readonly children: EvolutionNodeViewModel[];
}

export interface PokemonEncounter {
  readonly location_area: PokemonNamedResource;
  readonly version_details: readonly { readonly max_chance: number; readonly version: PokemonNamedResource }[];
}

export interface TypeEffectiveness {
  readonly weaknesses: readonly TypeMultiplier[];
  readonly resistances: readonly TypeMultiplier[];
  readonly immunities: readonly TypeMultiplier[];
}
export interface TypeMultiplier { readonly type: string; readonly multiplier: number; }

export interface PokemonSpriteOption { readonly id: string; readonly label: string; readonly url: string; }
export interface PokemonAbilityViewModel { readonly name: string; readonly displayName: string; readonly isHidden: boolean; readonly description: string; }
export interface PokemonMoveViewModel { readonly name: string; readonly displayName: string; readonly method: string; readonly level: number; }
export interface PokemonEncounterViewModel { readonly location: string; readonly versions: string[]; readonly chance: number; }

export interface PokemonAdvancedDetail {
  readonly pokemon: Pokemon;
  readonly species: PokemonSpecies;
  readonly varieties: PokemonCardViewModel[];
  readonly abilities: PokemonAbilityViewModel[];
  readonly effectiveness: TypeEffectiveness;
  readonly evolution: EvolutionNodeViewModel | null;
  readonly encounters: PokemonEncounterViewModel[];
  readonly sprites: PokemonSpriteOption[];
}
