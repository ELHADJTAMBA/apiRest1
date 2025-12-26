import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { CountryService, Country } from '../../services/country.service';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { WeatherAnimationComponent } from '../../../shared/components/weather-animation/weather-animation.component';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LoadingSpinnerComponent, 
    ErrorMessageComponent,
    WeatherAnimationComponent
  ],
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  country: Country | null = null;
  weather: WeatherData | null = null;
  isLoading = true;
  isLoadingWeather = false;
  errorMessage = '';
  weatherError = '';
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private countryService: CountryService,
    private weatherService: WeatherService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCountry();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCountry(): void {
    const countryCode = this.route.snapshot.paramMap.get('code');
    
    if (!countryCode) {
      this.errorMessage = 'Aucun code pays spécifié';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const sub = this.countryService.getCountryByCode(countryCode).subscribe({
      next: (country) => {
        this.country = country;
        this.loadWeather(country);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading country:', err);
        this.errorMessage = 'Impossible de charger les détails du pays. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
    this.subscriptions.add(sub);
  }

  private loadWeather(country: Country): void {
    if (!country.capital || country.capital.length === 0) {
      this.weatherError = 'Aucune capitale trouvée pour ce pays.';
      return;
    }

    this.isLoadingWeather = true;
    this.weatherError = '';

    // Essayer d'abord avec les coordonnées si disponibles
    if (country.latlng && country.latlng.length >= 2) {
      const lat = country.latlng[0];
      const lon = country.latlng[1];
      const sub = this.weatherService.getWeatherByCoords(lat, lon).subscribe({
        next: (weather) => {
          this.weather = weather;
          this.isLoadingWeather = false;
        },
        error: (err) => {
          console.error('Error loading weather by coordinates, trying by city name...', err);
          // Si échec avec les coordonnées, essayer avec le nom de la capitale
          if (country.capital && country.capital.length > 0) {
            this.loadWeatherByCity(country.capital[0]);
          } else {
            this.weatherError = 'Impossible de charger la météo : aucune capitale disponible';
            this.isLoadingWeather = false;
          }
        }
      });
      this.subscriptions.add(sub);
    } else if (country.capital && country.capital.length > 0) {
      // Si pas de coordonnées, utiliser le nom de la capitale
      this.loadWeatherByCity(country.capital[0]);
    } else {
      this.weatherError = 'Aucune information de localisation disponible pour ce pays';
      this.isLoadingWeather = false;
    }
  }

  private loadWeatherByCity(city: string): void {
    const sub = this.weatherService.getWeatherByCity(city).subscribe({
      next: (weather) => {
        this.weather = weather;
        this.isLoadingWeather = false;
      },
      error: (err) => {
        console.error('Error loading weather by city:', err);
        this.weatherError = 'Impossible de charger les données météorologiques pour la capitale.';
        this.isLoadingWeather = false;
      }
    });
    this.subscriptions.add(sub);
  }

  getLanguageNames(): string {
    if (!this.country?.languages) return 'Non spécifiées';
    return Object.values(this.country.languages).join(', ');
  }

  getCurrencyInfo(currencies: { [key: string]: { name: string; symbol?: string } } | undefined): string {
    if (!currencies) return 'Non spécifié';
    return Object.entries(currencies).map(([code, currency]) => {
      return `${currency.name} (${currency.symbol || 'Aucun symbole'})`;
    }).join(', ');
  }

  getObjectValues(obj: any): string[] {
    return obj ? Object.values(obj) : [];
  }

  getNativeName(nativeName: { [key: string]: { official: string; common: string } }): string {
    if (!nativeName) return '';
    const firstKey = Object.keys(nativeName)[0];
    return nativeName[firstKey]?.common || nativeName[firstKey]?.official || '';
  }

  getWeatherDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSafeMapUrl(): SafeResourceUrl {
    if (!this.country) return '';
    
    let url: string;
    
    if (this.country.latlng && this.country.latlng.length >= 2) {
      const lat = this.country.latlng[0];
      const lng = this.country.latlng[1];
      // Utilisation d'OpenStreetMap avec Leaflet
      url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-5}%2C${lat-5}%2C${lng+5}%2C${lat+5}&layer=mapnik`;
    } else {
      // Fallback vers une recherche par nom de pays si pas de coordonnées
      const query = encodeURIComponent(this.country.name.common);
      url = `https://www.openstreetmap.org/export/embed.html?q=${query}&layer=mapnik`;
    }
    
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
