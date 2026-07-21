import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home').then(
        (component) => component.Home,
      ),
    title: 'Inicio | Angular Studio',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(
        (component) => component.Login,
      ),
    title: 'Iniciar sesión | Angular Studio',
  },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(
        (component) => component.Register,
      ),
    title: 'Registro | Angular Studio',
  },
  {
    path: 'recuperar-contrasena',
    canActivate: [guestGuard],
    loadComponent: () =>
      import(
        './features/auth/pages/forgot-password/forgot-password'
      ).then(
        (component) => component.ForgotPassword,
      ),
    title: 'Recuperar contraseña | Angular Studio',
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './layout/dashboard-layout/dashboard-layout'
      ).then(
        (component) => component.DashboardLayout,
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard/dashboard'
          ).then(
            (component) => component.Dashboard,
          ),
        title: 'Dashboard | Angular Studio',
      },
      {
        path: 'calculadora',
        loadComponent: () =>
          import(
            './features/calculator/pages/calculator/calculator'
          ).then(
            (component) => component.Calculator,
          ),
        title: 'Calculadora | Angular Studio',
      },
      {
        path: 'calendario',
        loadComponent: () =>
          import(
            './features/calendar/pages/calendar/calendar'
          ).then(
            (component) => component.Calendar,
          ),
        title: 'Calendario | Angular Studio',
      },
      {
        path: 'api',
        loadChildren: () =>
          import(
            './features/api-playground/api-playground.routes'
          ).then(
            (routes) => routes.API_PLAYGROUND_ROUTES,
          ),
        title: 'API Playground | Angular Studio',
      },
      {
        path: 'crud-lab',
        loadComponent: () =>
          import('./features/crud-lab/pages/crud-lab/crud-lab').then(
            (component) => component.CrudLab,
          ),
        title: 'CRUD Lab | Angular Studio',
      },
      {
        path: 'herramientas',
        loadComponent: () =>
          import('./features/developer-tools/pages/developer-tools/developer-tools').then(
            (component) => component.DeveloperTools,
          ),
        title: 'Developer Tools | Angular Studio',
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile').then(
            (component) => component.Profile,
          ),
        title: 'Mi perfil | Angular Studio',
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then(
            (component) => component.Settings,
          ),
        title: 'Configuración | Angular Studio',
      },
      {
        path: 'acerca-de',
        loadComponent: () =>
          import(
            './features/about/pages/about/about'
          ).then(
            (component) => component.About,
          ),
        title: 'Acerca de | Angular Studio',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import(
        './features/not-found/pages/not-found/not-found'
      ).then(
        (component) => component.NotFound,
      ),
    title: 'Página no encontrada | Angular Studio',
  },
];
