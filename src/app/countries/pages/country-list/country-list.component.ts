import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CountryService, Country } from '../../services/country.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Liste des pays</h1>
      
      <!-- Barre de recherche -->
      <div class="mb-6">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="filterCountries()"
          placeholder="Rechercher un pays..."
          class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Filtre par région -->
      <div class="mb-6">
        <select 
          [(ngModel)]="selectedRegion" 
          (change)="filterCountries()"
          class="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les régions</option>
          <option *ngFor="let region of regions" [value]="region">{{ region }}</option>
        </select>
      </div>

      <!-- Chargement -->
      <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>

      <!-- Message d'erreur -->
      <app-error-message 
        *ngIf="errorMessage" 
        [message]="errorMessage"
        type="error"
      ></app-error-message>

      <!-- Liste des pays -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          *ngFor="let country of filteredCountries; let i = index"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 country-card"
          [attr.data-index]="i"
        >
          <!-- Debug info -->
          <div *ngIf="i === 0" class="hidden">
            <p>Total pays: {{filteredCountries.length}}</p>
            <p>Premier pays: {{filteredCountries[0] | json}}</p>
          </div>
          <img 
            [src]="country.flags.png" 
            [alt]="'Drapeau de ' + country.name.common"
            class="w-full h-40 object-cover"
          >
          <div class="p-4">
            <h2 class="text-xl font-semibold mb-2">{{ country.name.common }}</h2>
            <p class="text-gray-600">{{ country.region }}</p>
            <a 
              [routerLink]="['/countries', country.cca3]"
              class="mt-4 inline-block text-blue-600 hover:underline"
            >
              Voir les détails →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CountryListComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  searchTerm: string = '';
  selectedRegion: string = '';
  regions: string[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    console.log('Début du chargement des pays...');
    this.isLoading = true;
    this.errorMessage = '';
    
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        console.log('Pays reçus du service:', countries);
        this.countries = countries;
        console.log(`Nombre de pays chargés: ${this.countries.length}`);
        this.filteredCountries = [...this.countries];
        console.log('Pays après copie dans filteredCountries:', this.filteredCountries.length);
        this.extractRegions();
        this.isLoading = false;
        
        // Vérifier si le template est correctement lié
        setTimeout(() => {
          console.log('Vérification du DOM après chargement...');
          const countryElements = document.querySelectorAll('.country-card');
          console.log(`Nombre d'éléments pays dans le DOM: ${countryElements.length}`);
        }, 1000);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pays:', error);
        if (error.error) {
          console.error('Détails de l\'erreur:', error.error);
        }
        this.errorMessage = 'Impossible de charger la liste des pays. Veuillez vérifier votre connexion Internet et réessayer.';
        this.isLoading = false;
      }
    });
  }

  extractRegions(): void {
    const regionsSet = new Set<string>();
    this.countries.forEach(country => {
      if (country.region) {
        regionsSet.add(country.region);
      }
    });
    this.regions = Array.from(regionsSet).sort();
  }

  filterCountries(): void {
    this.filteredCountries = this.countries.filter(country => {
      const searchTerm = this.searchTerm.toLowerCase();
      const matchesSearch = country.name.common.toLowerCase().includes(searchTerm) || 
                          (country.name.official && country.name.official.toLowerCase().includes(searchTerm));
      const matchesRegion = !this.selectedRegion || country.region === this.selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }
}
