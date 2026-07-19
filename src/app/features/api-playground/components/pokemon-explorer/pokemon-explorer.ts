import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import {
  EvolutionNodeViewModel, PokemonAdvancedDetail, PokemonCardViewModel,
  PokemonFormCategory, PokemonFormFilterOption, PokemonMoveViewModel,
} from '../../models/pokemon.model';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonCollectionService } from '../../services/pokemon-collection.service';

type DetailTab = 'overview' | 'battle' | 'evolution' | 'moves' | 'games';
type PokemonRegionId =
  | 'all'
  | 'kanto'
  | 'johto'
  | 'hoenn'
  | 'sinnoh'
  | 'unova'
  | 'kalos'
  | 'alola'
  | 'galar'
  | 'paldea';

interface PokemonRegionFilter {
  readonly id: PokemonRegionId;
  readonly label: string;
  readonly startId: number;
  readonly endId: number;
}


interface PokemonGameCover {
  readonly name: string;
  readonly displayName: string;
  readonly coverUrl: string;
  readonly generation: number;
  readonly region: string;
}

const GAME_COVER_FILES: Readonly<Record<string, string>> = {
  red: '/assets/images/pokemon-games/red.webp',
  blue: '/assets/images/pokemon-games/blue.webp',
  yellow: '/assets/images/pokemon-games/yellow.webp',
  gold: '/assets/images/pokemon-games/gold.webp',
  silver: '/assets/images/pokemon-games/silver.webp',
  crystal: '/assets/images/pokemon-games/crystal.webp',
  ruby: '/assets/images/pokemon-games/ruby.webp',
  sapphire: '/assets/images/pokemon-games/sapphire.webp',
  emerald: '/assets/images/pokemon-games/emerald.webp',
  firered: '/assets/images/pokemon-games/firered.webp',
  leafgreen: '/assets/images/pokemon-games/leafgreen.webp',
  diamond: '/assets/images/pokemon-games/diamond.webp',
  pearl: '/assets/images/pokemon-games/pearl.webp',
  platinum: '/assets/images/pokemon-games/platinum.webp',
  heartgold: '/assets/images/pokemon-games/heartgold.webp',
  soulsilver: '/assets/images/pokemon-games/soulsilver.webp',
  black: '/assets/images/pokemon-games/black.webp',
  white: '/assets/images/pokemon-games/white.webp',
  'black-2': '/assets/images/pokemon-games/black-2.webp',
  'white-2': '/assets/images/pokemon-games/white-2.webp',
  x: '/assets/images/pokemon-games/x.webp',
  y: '/assets/images/pokemon-games/y.webp',
  'omega-ruby': '/assets/images/pokemon-games/omega-ruby.webp',
  'alpha-sapphire': '/assets/images/pokemon-games/alpha-sapphire.webp',
  sun: '/assets/images/pokemon-games/sun.webp',
  moon: '/assets/images/pokemon-games/moon.webp',
  'ultra-sun': '/assets/images/pokemon-games/ultra-sun.webp',
  'ultra-moon': '/assets/images/pokemon-games/ultra-moon.webp',
  'lets-go-pikachu': '/assets/images/pokemon-games/lets-go-pikachu.webp',
  'lets-go-eevee': '/assets/images/pokemon-games/lets-go-eevee.webp',
  sword: '/assets/images/pokemon-games/sword.webp',
  shield: '/assets/images/pokemon-games/shield.webp',
  'brilliant-diamond': '/assets/images/pokemon-games/brilliant-diamond.webp',
  'shining-pearl': '/assets/images/pokemon-games/shining-pearl.webp',
  'legends-arceus': '/assets/images/pokemon-games/legends-arceus.webp',
  scarlet: '/assets/images/pokemon-games/scarlet.webp',
  violet: '/assets/images/pokemon-games/violet.webp',
  'legends-za': '/assets/images/pokemon-games/legends-za.webp',
  winds: '/assets/images/pokemon-games/winds.webp',
  waves: '/assets/images/pokemon-games/waves.webp',
};

const GAME_DISPLAY_NAMES: Readonly<Record<string, string>> = {
  firered: 'FireRed',
  leafgreen: 'LeafGreen',
  heartgold: 'HeartGold',
  soulsilver: 'SoulSilver',
  'black-2': 'Black 2',
  'white-2': 'White 2',
  'omega-ruby': 'Omega Ruby',
  'alpha-sapphire': 'Alpha Sapphire',
  'ultra-sun': 'Ultra Sun',
  'ultra-moon': 'Ultra Moon',
  'lets-go-pikachu': "Let's Go, Pikachu!",
  'lets-go-eevee': "Let's Go, Eevee!",
  'brilliant-diamond': 'Brilliant Diamond',
  'shining-pearl': 'Shining Pearl',
  'legends-arceus': 'Legends: Arceus',
  'legends-za': 'Legends: Z-A',
  'winds': 'Winds',
  'waves': 'Waves',
};

const REGION_BY_GENERATION: Readonly<Record<string, string>> = {
  'generation-i': 'Kanto',
  'generation-ii': 'Johto',
  'generation-iii': 'Hoenn',
  'generation-iv': 'Sinnoh',
  'generation-v': 'Unova',
  'generation-vi': 'Kalos',
  'generation-vii': 'Alola',
  'generation-viii': 'Galar',
  'generation-ix': 'Paldea',
  'generation-x': 'Por anunciar',
};

const GAME_GENERATIONS: Readonly<Record<string, number>> = {
  red: 1,
  blue: 1,
  yellow: 1,

  gold: 2,
  silver: 2,
  crystal: 2,

  ruby: 3,
  sapphire: 3,
  emerald: 3,
  firered: 3,
  leafgreen: 3,

  diamond: 4,
  pearl: 4,
  platinum: 4,
  heartgold: 4,
  soulsilver: 4,

  black: 5,
  white: 5,
  'black-2': 5,
  'white-2': 5,

  x: 6,
  y: 6,
  'omega-ruby': 6,
  'alpha-sapphire': 6,

  sun: 7,
  moon: 7,
  'ultra-sun': 7,
  'ultra-moon': 7,
  'lets-go-pikachu': 7,
  'lets-go-eevee': 7,

  sword: 8,
  shield: 8,
  'brilliant-diamond': 8,
  'shining-pearl': 8,
  'legends-arceus': 8,

  scarlet: 9,
  violet: 9,
  'legends-za': 9,

  winds: 10,
  waves: 10,
};

const GAME_REGIONS: Readonly<Record<string, string>> = {
  red: 'Kanto',
  blue: 'Kanto',
  yellow: 'Kanto',
  firered: 'Kanto',
  leafgreen: 'Kanto',
  'lets-go-pikachu': 'Kanto',
  'lets-go-eevee': 'Kanto',

  gold: 'Johto',
  silver: 'Johto',
  crystal: 'Johto',
  heartgold: 'Johto',
  soulsilver: 'Johto',

  ruby: 'Hoenn',
  sapphire: 'Hoenn',
  emerald: 'Hoenn',
  'omega-ruby': 'Hoenn',
  'alpha-sapphire': 'Hoenn',

  diamond: 'Sinnoh',
  pearl: 'Sinnoh',
  platinum: 'Sinnoh',
  'brilliant-diamond': 'Sinnoh',
  'shining-pearl': 'Sinnoh',

  'legends-arceus': 'Hisui',

  black: 'Unova',
  white: 'Unova',
  'black-2': 'Unova',
  'white-2': 'Unova',

  x: 'Kalos',
  y: 'Kalos',
  'legends-za': 'Kalos',

  sun: 'Alola',
  moon: 'Alola',
  'ultra-sun': 'Alola',
  'ultra-moon': 'Alola',

  sword: 'Galar',
  shield: 'Galar',

  scarlet: 'Paldea',
  violet: 'Paldea',

  winds: 'Por anunciar',
  waves: 'Por anunciar',
};

const VERSION_GROUP_GAMES: Readonly<Record<string, readonly string[]>> = {
  'red-blue': ['red', 'blue'],
  yellow: ['yellow'],
  'gold-silver': ['gold', 'silver'],
  crystal: ['crystal'],
  'ruby-sapphire': ['ruby', 'sapphire'],
  emerald: ['emerald'],
  'firered-leafgreen': ['firered', 'leafgreen'],
  'diamond-pearl': ['diamond', 'pearl'],
  platinum: ['platinum'],
  'heartgold-soulsilver': ['heartgold', 'soulsilver'],
  'black-white': ['black', 'white'],
  'black-2-white-2': ['black-2', 'white-2'],
  'x-y': ['x', 'y'],
  'omega-ruby-alpha-sapphire': ['omega-ruby', 'alpha-sapphire'],
  'sun-moon': ['sun', 'moon'],
  'ultra-sun-ultra-moon': ['ultra-sun', 'ultra-moon'],
  'lets-go-pikachu-lets-go-eevee': ['lets-go-pikachu', 'lets-go-eevee'],
  'sword-shield': ['sword', 'shield'],
  'brilliant-diamond-and-shining-pearl': ['brilliant-diamond', 'shining-pearl'],
  'legends-arceus': ['legends-arceus'],
  'scarlet-violet': ['scarlet', 'violet'],
  'legends-za': ['legends-za'],
  'winds-waves': ['winds', 'waves'],
};

const GAME_ORDER = Object.keys(GAME_COVER_FILES);

@Component({
  selector: 'app-pokemon-explorer', standalone: true, imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './pokemon-explorer.html', styleUrl: './pokemon-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonExplorerComponent {
  private readonly pokemonService = inject(PokemonService);
  readonly collection = inject(PokemonCollectionService);
  private readonly pageSize = 20;

  readonly regionFilters: readonly PokemonRegionFilter[] = [
    { id: 'all', label: 'Nacional', startId: 1, endId: 1025 },
    { id: 'kanto', label: 'Kanto', startId: 1, endId: 151 },
    { id: 'johto', label: 'Johto', startId: 152, endId: 251 },
    { id: 'hoenn', label: 'Hoenn', startId: 252, endId: 386 },
    { id: 'sinnoh', label: 'Sinnoh', startId: 387, endId: 493 },
    { id: 'unova', label: 'Unova', startId: 494, endId: 649 },
    { id: 'kalos', label: 'Kalos', startId: 650, endId: 721 },
    { id: 'alola', label: 'Alola', startId: 722, endId: 809 },
    { id: 'galar', label: 'Galar', startId: 810, endId: 905 },
    { id: 'paldea', label: 'Paldea', startId: 906, endId: 1025 },
  ];

  readonly formFilters: readonly PokemonFormFilterOption[] = [
    { id: 'all', label: 'Todas' }, { id: 'default', label: 'Normal' },
    { id: 'alola', label: 'Alola' }, { id: 'galar', label: 'Galar' },
    { id: 'hisui', label: 'Hisui' }, { id: 'paldea', label: 'Paldea' },
    { id: 'mega', label: 'Mega' }, { id: 'dynamax', label: 'Gigamax' },
    { id: 'primal', label: 'Primal' }, { id: 'totem', label: 'Tótem' },
    { id: 'other', label: 'Otras' },
  ];

  readonly detailTabs: readonly { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Resumen' }, { id: 'battle', label: 'Combate' },
    { id: 'evolution', label: 'Evolución' }, { id: 'moves', label: 'Movimientos' },
    { id: 'games', label: 'Juegos y hábitat' },
  ];

  readonly pokemon = signal<PokemonCardViewModel[]>([]);
  readonly detail = signal<PokemonAdvancedDetail | null>(null);
  readonly selectedCategory = signal<PokemonFormCategory>('default');
  readonly selectedRegion = signal<PokemonRegionId>('all');
  readonly selectedTab = signal<DetailTab>('overview');
  readonly searchTerm = signal('');
  readonly moveSearch = signal('');
  readonly selectedSpriteUrl = signal('');
  readonly loading = signal(false);
  readonly detailLoading = signal(false);
  readonly errorMessage = signal('');
  readonly currentPage = signal(1);
  readonly totalPokemon = signal(0);
  readonly typeFilter = signal('all');
  readonly favoritesOnly = signal(false);
  readonly comparisonSelection = signal<PokemonCardViewModel[]>([]);
  readonly comparisonDetails = signal<PokemonAdvancedDetail[]>([]);
  readonly comparisonLoading = signal(false);
  readonly collectionMessage = signal('');

  readonly pokemonTypes = ['all','normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'] as const;
  readonly visiblePokemon = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    return this.pokemon().filter((item) =>
      (!query || item.displayName.toLowerCase().includes(query) || String(item.id).includes(query))
      && (this.typeFilter() === 'all' || item.types.includes(this.typeFilter()))
      && (!this.favoritesOnly() || this.collection.isFavorite(item.name))
    );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalPokemon() / this.pageSize)));
  readonly selectedFormLabel = computed(() => {
    const current = this.detail();
    return current ? this.pokemonService.getFormLabel(this.pokemonService.getFormCategory(current.pokemon.name)) : '';
  });
  readonly speciesDescription = computed(() => {
    const entries = this.detail()?.species.flavor_text_entries ?? [];
    const spanish = entries.find((entry) => entry.language.name === 'es');
    const english = entries.find((entry) => entry.language.name === 'en');
    return (spanish?.flavor_text ?? english?.flavor_text ?? 'Descripción no disponible.').replace(/[\n\f]/g, ' ');
  });
  readonly genus = computed(() => {
    const genera = this.detail()?.species.genera ?? [];
    return genera.find((item) => item.language.name === 'es')?.genus
      ?? genera.find((item) => item.language.name === 'en')?.genus
      ?? 'Pokémon';
  });
  readonly originRegion = computed(() => {
    const generationName = this.detail()?.species.generation.name;

    if (!generationName) {
      return 'N/D';
    }

    return REGION_BY_GENERATION[generationName] ?? 'Desconocida';
  });

  readonly genderLabel = computed(() => {
    const rate = this.detail()?.species.gender_rate ?? -1;
    if (rate < 0) return 'Sin género';
    const female = (rate / 8) * 100;
    return `${100 - female}% ♂ · ${female}% ♀`;
  });
  readonly moves = computed<PokemonMoveViewModel[]>(() => {
    const current = this.detail();
    if (!current) return [];
    const query = this.moveSearch().trim().toLowerCase();
    return current.pokemon.moves
      .map((slot) => {
        const version = slot.version_group_details.at(-1);
        return {
          name: slot.move.name,
          displayName: this.formatName(slot.move.name),
          method: this.formatName(version?.move_learn_method.name ?? 'unknown'),
          level: version?.level_learned_at ?? 0,
        };
      })
      .filter((move) => !query || move.displayName.toLowerCase().includes(query) || move.method.toLowerCase().includes(query))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  });
  readonly games = computed<PokemonGameCover[]>(() => {
    const current = this.detail();

    if (!current) {
      return [];
    }

    const versionNames = new Set<string>();

    current.pokemon.game_indices.forEach((item) => versionNames.add(item.version.name));
    current.species.flavor_text_entries.forEach((entry) => versionNames.add(entry.version.name));
    current.encounters.forEach((encounter) => {
      encounter.versions.forEach((version) => versionNames.add(version));
    });

    current.pokemon.moves.forEach((move) => {
      move.version_group_details.forEach((detail) => {
        VERSION_GROUP_GAMES[detail.version_group.name]?.forEach((version) => {
          versionNames.add(version);
        });
      });
    });

    return [...versionNames]
      .filter((name) => Boolean(GAME_COVER_FILES[name]))
      .sort((a, b) => GAME_ORDER.indexOf(a) - GAME_ORDER.indexOf(b))
      .map((name) => ({
        name,
        displayName: GAME_DISPLAY_NAMES[name] ?? this.formatName(name),
        coverUrl: this.getGameCoverUrl(name),
        generation: GAME_GENERATIONS[name] ?? 0,
        region: GAME_REGIONS[name] ?? 'Desconocida',
      }));
  });

  constructor() { this.loadPage(); }

  loadPage(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const selectedRegion = this.regionFilters.find(
      (region) => region.id === this.selectedRegion(),
    );

    const pageOffset = (this.currentPage() - 1) * this.pageSize;
    const isRegionalPokedex =
      this.selectedCategory() === 'default'
      && selectedRegion !== undefined
      && selectedRegion.id !== 'all';

    const startId = isRegionalPokedex ? selectedRegion.startId : undefined;
    const endId = isRegionalPokedex ? selectedRegion.endId : undefined;

    this.pokemonService
      .getPokemonPage(
        this.selectedCategory(),
        this.pageSize,
        pageOffset,
        startId,
        endId,
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.totalPokemon.set(response.count);
          this.pokemon.set(response.items);
        },
        error: () => {
          this.pokemon.set([]);
          this.totalPokemon.set(0);
          this.errorMessage.set('No fue posible cargar el listado de Pokémon.');
        },
      });
  }

  changeRegion(region: PokemonRegionId): void {
    this.selectedRegion.set(region);
    this.selectedCategory.set('default');
    this.currentPage.set(1);
    this.closeDetail();
    this.loadPage();
  }

  changeCategory(category: PokemonFormCategory): void {
    if (this.selectedCategory() === category && this.selectedRegion() === 'all') {
      return;
    }

    this.selectedCategory.set(category);
    this.selectedRegion.set('all');
    this.currentPage.set(1);
    this.closeDetail();
    this.loadPage();
  }

  search(): void { const value = this.searchTerm().trim(); if (value) this.openPokemon(value); }

  openPokemon(identifier: string | number): void {
    this.detailLoading.set(true); this.errorMessage.set(''); this.selectedTab.set('overview'); this.moveSearch.set('');
    this.pokemonService.getAdvancedDetail(identifier)
      .pipe(finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
          this.selectedSpriteUrl.set(detail.sprites[0]?.url ?? '');
          queueMicrotask(() => document.querySelector('.pokemon-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        },
        error: () => this.errorMessage.set('No encontramos ese Pokémon o no pudimos cargar todos sus datos.'),
      });
  }


  toggleFavorite(item: PokemonCardViewModel, event?: Event): void {
    event?.stopPropagation();
    this.collection.toggleFavorite(item);
  }

  toggleTeam(item: PokemonCardViewModel, event?: Event): void {
    event?.stopPropagation();
    const changed = this.collection.toggleTeam(item);
    this.collectionMessage.set(changed ? '' : 'El equipo ya tiene el máximo de 6 Pokémon.');
  }

  toggleComparison(item: PokemonCardViewModel, event?: Event): void {
    event?.stopPropagation();
    const current = this.comparisonSelection();
    if (current.some((entry) => entry.name === item.name)) {
      this.comparisonSelection.set(current.filter((entry) => entry.name !== item.name));
      this.comparisonDetails.set([]);
      return;
    }
    if (current.length >= 2) return;
    this.comparisonSelection.set([...current, item]);
    this.comparisonDetails.set([]);
  }

  compareSelected(): void {
    const selected = this.comparisonSelection();
    if (selected.length !== 2) return;
    this.comparisonLoading.set(true);
    forkJoin(selected.map((item) => this.pokemonService.getAdvancedDetail(item.name)))
      .pipe(finalize(() => this.comparisonLoading.set(false)))
      .subscribe({ next: (items) => this.comparisonDetails.set(items), error: () => this.errorMessage.set('No fue posible comparar los Pokémon seleccionados.') });
  }

  clearAdvancedFilters(): void {
    this.searchTerm.set(''); this.typeFilter.set('all'); this.favoritesOnly.set(false);
  }

  getCardForDetail(detail: PokemonAdvancedDetail): PokemonCardViewModel {
    return {
      id: detail.pokemon.id,
      name: detail.pokemon.name,
      displayName: this.formatName(detail.pokemon.name),
      imageUrl: detail.sprites[0]?.url ?? detail.pokemon.sprites.front_default ?? '',
      types: detail.pokemon.types.map((entry) => entry.type.name),
      formCategory: this.pokemonService.getFormCategory(detail.pokemon.name),
      formLabel: this.pokemonService.getFormLabel(this.pokemonService.getFormCategory(detail.pokemon.name)),
      isDefault: detail.pokemon.is_default,
    };
  }

  closeDetail(): void { this.detail.set(null); this.selectedSpriteUrl.set(''); }
  previousPage(): void { if (this.currentPage() > 1) { this.currentPage.update((p) => p - 1); this.loadPage(); } }
  nextPage(): void { if (this.currentPage() < this.totalPages()) { this.currentPage.update((p) => p + 1); this.loadPage(); } }
  selectSprite(url: string): void { this.selectedSpriteUrl.set(url); }
  playCry(url: string | null | undefined): void { if (url) void new Audio(url).play(); }
  formatName(value: string): string { return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }
  getStatPercentage(value: number): number { return Math.min(100, Math.round((value / 255) * 100)); }
  formatHeightImperial(decimeters: number): string {
    const totalInches = Math.round(decimeters * 3.937007874);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;

    return `${feet}′ ${inches}″`;
  }

  formatWeightImperial(hectograms: number): string {
    const pounds = hectograms * 0.2204622622;
    return `${pounds.toFixed(1)} Libras`;
  }

  evolutionTrack(node: EvolutionNodeViewModel): string { return node.name; }

  onGameCoverError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallbackUrl = '/assets/images/pokemon-games/fallback.webp';

    if (image.dataset['fallbackApplied'] === 'true') {
      image.hidden = true;
      image.closest('.game-cover-card')?.classList.add('game-cover-card--fallback');
      return;
    }

    image.dataset['fallbackApplied'] = 'true';
    image.src = fallbackUrl;
  }

  private getGameCoverUrl(gameName: string): string {
    return GAME_COVER_FILES[gameName] ?? '';
  }

  getEggGroups(): string {
    const groups = this.detail()?.species.egg_groups ?? [];
    return groups.length ? groups.map((item) => this.formatName(item.name)).join(', ') : 'N/D';
  }
}