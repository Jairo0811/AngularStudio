import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PokemonCollectionService } from '../../../api-playground/services/pokemon-collection.service';

@Component({selector:'app-profile',standalone:true,imports:[RouterLink],templateUrl:'./profile.html',styleUrl:'./profile.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly collection = inject(PokemonCollectionService);
  readonly user = this.auth.user;
  readonly favoritesCount = computed(() => this.collection.favorites().length);
  readonly teamCount = computed(() => this.collection.team().length);
  readonly initials = computed(() => (this.user()?.displayName ?? this.user()?.email ?? 'AS').split(/\s+/).slice(0,2).map(part => part[0]?.toUpperCase()).join(''));
}
