import { Route } from '@angular/router';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';

const POKEMONS_ROUTES: Route[] = [
  {
    path: '',
    component: PokemonListComponent,
    title: 'Liste des Pokémons'
  },
  {
    path: ':id',
    component: PokemonDetailComponent,
    title: 'Détails du Pokémon'
  }
];

export { POKEMONS_ROUTES };
