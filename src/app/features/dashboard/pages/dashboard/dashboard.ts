import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { PokemonCollectionService } from '../../../api-playground/services/pokemon-collection.service';

interface DashboardModule { readonly title:string; readonly description:string; readonly route:string; readonly icon:string; readonly status:string; }

@Component({selector:'app-dashboard',imports:[RouterLink],templateUrl:'./dashboard.html',styleUrl:'./dashboard.scss',changeDetection:ChangeDetectionStrategy.OnPush})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly collection = inject(PokemonCollectionService);
  readonly user = this.authService.user;
  readonly favoritesCount = computed(() => this.collection.favorites().length);
  readonly teamCount = computed(() => this.collection.team().length);
  readonly crudCount = computed(() => {
    try { return (JSON.parse(localStorage.getItem('angular-studio:crud-lab:pokemon') ?? '[]') as unknown[]).length; } catch { return 0; }
  });

  readonly modules: readonly DashboardModule[] = [
    {title:'Pokédex avanzada',description:'Regiones, formas, favoritos, comparador y equipos.',route:'/api/pokemon',icon:'PK',status:'Completado'},
    {title:'CRUD Lab',description:'Gestión manual de registros con persistencia local.',route:'/crud-lab',icon:'DB',status:'Completado'},
    {title:'Developer Tools',description:'JSON, Base64, UUID y contraseñas seguras.',route:'/herramientas',icon:'</>',status:'Nuevo'},
    {title:'Calculadora Angular',description:'Calculadora modular construida con Angular moderno.',route:'/calculadora',icon:'∑',status:'Completado'},
    {title:'API Playground',description:'Exploradores REST para usuarios, países y Pokémon.',route:'/api',icon:'API',status:'Completado'},
    {title:'Perfil y configuración',description:'Cuenta Firebase, preferencias y datos locales.',route:'/perfil',icon:'◉',status:'Nuevo'},
  ];

  get displayName(): string { return this.user()?.displayName ?? this.user()?.email?.split('@')[0] ?? 'Usuario'; }
}
