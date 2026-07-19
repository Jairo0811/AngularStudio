import { Routes } from '@angular/router';

export const API_PLAYGROUND_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/api-playground/api-playground').then(
        (component) => component.ApiPlaygroundComponent,
      ),
    title: 'API Playground | Angular Studio',
  },
  {
    path: 'pokemon',
    loadComponent: () =>
      import('./components/pokemon-explorer/pokemon-explorer').then(
        (component) => component.PokemonExplorerComponent,
      ),
    title: 'Pokédex | Angular Studio',
  },
];