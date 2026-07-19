import { Injectable, signal } from '@angular/core';
import { PokemonCardViewModel } from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonCollectionService {
  private readonly favoritesKey = 'angular-studio:pokemon:favorites';
  private readonly teamKey = 'angular-studio:pokemon:team';

  readonly favorites = signal<PokemonCardViewModel[]>(this.read(this.favoritesKey));
  readonly team = signal<PokemonCardViewModel[]>(this.read(this.teamKey));

  isFavorite(name: string): boolean { return this.favorites().some((item) => item.name === name); }
  isInTeam(name: string): boolean { return this.team().some((item) => item.name === name); }

  toggleFavorite(pokemon: PokemonCardViewModel): void {
    const next = this.isFavorite(pokemon.name)
      ? this.favorites().filter((item) => item.name !== pokemon.name)
      : [...this.favorites(), pokemon];
    this.favorites.set(next);
    this.write(this.favoritesKey, next);
  }

  toggleTeam(pokemon: PokemonCardViewModel): boolean {
    if (this.isInTeam(pokemon.name)) {
      const next = this.team().filter((item) => item.name !== pokemon.name);
      this.team.set(next); this.write(this.teamKey, next); return true;
    }
    if (this.team().length >= 6) return false;
    const next = [...this.team(), pokemon];
    this.team.set(next); this.write(this.teamKey, next); return true;
  }

  private read(key: string): PokemonCardViewModel[] {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]') as PokemonCardViewModel[]; }
    catch { return []; }
  }
  private write(key: string, value: PokemonCardViewModel[]): void { localStorage.setItem(key, JSON.stringify(value)); }
}
