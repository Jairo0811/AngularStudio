import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ApiTabsComponent } from '../../components/api-tabs/api-tabs';
import { FlagsGalleryComponent } from '../../components/flags-gallery/flags-gallery';
import { PokemonExplorerComponent } from '../../components/pokemon-explorer/pokemon-explorer';
import { RandomUserExplorerComponent } from '../../components/random-user-explorer/random-user-explorer';
import { ApiTab, ApiTabId } from '../../models/api-tab.model';

@Component({
  selector: 'app-api-playground',
  standalone: true,
  imports: [
    ApiTabsComponent,
    RandomUserExplorerComponent,
    PokemonExplorerComponent,
    FlagsGalleryComponent
  ],
  templateUrl: './api-playground.html',
  styleUrl: './api-playground.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiPlaygroundComponent {
  readonly tabs: readonly ApiTab[] = [
    {
      id: 'random-users',
      label: 'Random Users',
      description: 'Perfiles internacionales generados dinámicamente.',
      icon: '👥'
    },
    {
      id: 'pokemon',
      label: 'Pokémon',
      description: 'Pokédex con búsqueda, tipos y estadísticas.',
      icon: '⚡'
    },
    {
      id: 'flags',
      label: 'Banderas',
      description: 'Países, capitales, regiones y códigos ISO.',
      icon: '🏳️'
    }
  ];

  readonly activeTab = signal<ApiTabId>('random-users');

  selectTab(tabId: ApiTabId): void {
    this.activeTab.set(tabId);
  }
}
