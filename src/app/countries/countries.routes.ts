import { Route } from '@angular/router';
import { CountryListComponent } from './pages/country-list/country-list.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';

const COUNTRIES_ROUTES: Route[] = [
  {
    path: '',
    component: CountryListComponent,
    title: 'Liste des pays'
  },
  {
    path: ':code',
    component: CountryDetailComponent,
    title: 'Détails du pays'
  }
];

export { COUNTRIES_ROUTES };
