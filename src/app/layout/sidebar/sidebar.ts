import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

interface SidebarItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
  readonly exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly navigationItems: readonly SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: '⌂',
      route: '/dashboard',
      exact: true,
    },
    {
      label: 'Calculadora',
      icon: '∑',
      route: '/calculadora',
    },
    {
      label: 'Calendario',
      icon: '▦',
      route: '/calendario',
    },
    {
      label: 'API Playground',
      icon: '⌘',
      route: '/api',
    },
    {
      label: 'CRUD Lab',
      icon: '✎',
      route: '/crud-lab',
    },
    {
      label: 'Developer Tools',
      icon: '</>',
      route: '/herramientas',
    },
    {
      label: 'Mi perfil',
      icon: '◉',
      route: '/perfil',
    },
    {
      label: 'Configuración',
      icon: '⚙',
      route: '/configuracion',
    },
    {
      label: 'Acerca del proyecto',
      icon: 'i',
      route: '/acerca-de',
    },
  ];
}
