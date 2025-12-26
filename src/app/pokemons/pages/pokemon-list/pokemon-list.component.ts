import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService, Pokemon, PokemonListResponse } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Liste des Pokémons</h1>
      
      <!-- Barre de recherche -->
      <div class="mb-6">
        <input 
          type="text" 
          [(ngModel)]="searchTerm" 
          (input)="filterPokemons()"
          placeholder="Rechercher un Pokémon..."
          class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Chargement -->
      <app-loading-spinner *ngIf="isLoading"></app-loading-spinner>

      <!-- Message d'erreur -->
      <app-error-message 
        *ngIf="errorMessage" 
        [message]="errorMessage"
        type="error"
      ></app-error-message>

      <!-- Liste des Pokémons -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          *ngFor="let pokemon of filteredPokemons"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <img 
            [src]="'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + getPokemonId(pokemon.url) + '.png'" 
            [alt]="pokemon.name"
            class="w-full h-32 object-contain p-4"
            onerror="this.src='assets/pokemon-placeholder.png'"
          >
          <div class="p-4 text-center">
            <h2 class="font-semibold capitalize">{{ pokemon.name }}</h2>
            <p class="text-sm text-gray-600">#{{ getPokemonId(pokemon.url) }}</p>
            <a 
              [routerLink]="['/pokemons', getPokemonId(pokemon.url)]"
              class="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              Voir détails
            </a>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center gap-2">
        <button 
          (click)="previousPage()" 
          [disabled]="!previousUrl || isLoading"
          class="px-4 py-2 border rounded-md disabled:opacity-50"
          [class.bg-gray-100]="!previousUrl"
        >
          Précédent
        </button>
        <button 
          (click)="nextPage()" 
          [disabled]="!nextUrl || isLoading"
          class="px-4 py-2 border rounded-md disabled:opacity-50"
          [class.bg-gray-100]="!nextUrl"
        >
          Suivant
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  nextUrl: string | null = null;
  previousUrl: string | null = null;
  count: number = 0;
  limit: number = 20;
  offset: number = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(url?: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.pokemonService.getPokemons(this.offset).subscribe({
      next: (response: any) => {
        this.pokemons = response.results;
        this.filteredPokemons = [...this.pokemons];
        this.nextUrl = response.next;
        this.previousUrl = response.previous;
        this.count = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pokemons:', error);
        this.errorMessage = 'Impossible de charger la liste des Pokémons. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  filterPokemons(): void {
    if (!this.searchTerm) {
      this.filteredPokemons = [...this.pokemons];
      return;
    }
    
    const searchTerm = this.searchTerm.toLowerCase();
    this.filteredPokemons = this.pokemons.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm) ||
      this.getPokemonId(pokemon.url).includes(searchTerm)
    );
  }

  nextPage(): void {
    if (this.nextUrl) {
      this.offset += this.limit;
      this.loadPokemons();
    }
  }

  previousPage(): void {
    if (this.previousUrl) {
      this.offset = Math.max(0, this.offset - this.limit);
      this.loadPokemons();
    }
  }
}
