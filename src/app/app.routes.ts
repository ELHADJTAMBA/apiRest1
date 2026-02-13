import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Import des routes des fonctionnalités
import { COUNTRIES_ROUTES } from './countries/countries.routes';
import { POKEMONS_ROUTES } from './pokemons/pokemons.routes';
import { AUTH_ROUTES } from './auth/auth.routes';
import { USERS_ROUTES } from './users/users.routes';

// Import des guards
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    title: 'Accueil'
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
    title: 'Authentification'
  },
  {
    path: 'countries',
    canActivate: [AuthGuard],
    children: COUNTRIES_ROUTES,
    title: 'Pays du monde'
  },
  {
    path: 'pokemons',
    canActivate: [AuthGuard],
    children: POKEMONS_ROUTES,
    title: 'Pokémons'
  },
  {
    path: 'users',
    canActivate: [AuthGuard, AdminGuard],
    children: USERS_ROUTES,
    title: 'Gestion des utilisateurs'
  },
  { 
    path: '**', 
    component: NotFoundComponent 
  }
];
