import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Import des routes des fonctionnalités
import { COUNTRIES_ROUTES } from './countries/countries.routes';
import { POKEMONS_ROUTES } from './pokemons/pokemons.routes';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Accueil'
  },
  {
    path: 'countries',
    children: COUNTRIES_ROUTES,
    title: 'Pays du monde'
  },
  {
    path: 'pokemons',
    children: POKEMONS_ROUTES,
    title: 'Pokémons'
  },
  { 
    path: '**', 
    component: NotFoundComponent 
  }
];
