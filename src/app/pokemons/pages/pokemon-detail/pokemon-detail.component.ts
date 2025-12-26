import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService, Pokemon } from '../../services/pokemon.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="container mx-auto p-4">
      <a 
        routerLink="/pokemons" 
        class="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        &larr; Retour à la liste
      </a>

      <div *ngIf="isLoading" class="flex justify-center my-12">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <app-error-message 
        *ngIf="errorMessage" 
        [message]="errorMessage"
        type="error"
      ></app-error-message>

      <div *ngIf="pokemon && !isLoading" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- En-tête avec image et nom -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div class="flex flex-col md:flex-row items-center">
            <div class="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
              <img 
                [src]="pokemon.sprites.other['official-artwork'].front_default || 'assets/pokemon-placeholder.png'"
                [alt]="pokemon.name"
                class="w-full h-full object-contain"
                onerror="this.src='assets/pokemon-placeholder.png'"
              >
            </div>
            <div class="mt-4 md:mt-0 md:ml-8 flex-1">
              <h1 class="text-3xl font-bold capitalize">{{ pokemon.name }}</h1>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  #{{ pokemon.id.toString().padStart(3, '0') }}
                </span>
                <span 
                  *ngFor="let type of pokemon.types" 
                  class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm capitalize"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Détails du Pokémon -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Caractéristiques -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Caractéristiques</h2>
              <div class="space-y-2">
                <p><span class="font-medium">Taille:</span> {{ pokemon.height / 10 }} m</p>
                <p><span class="font-medium">Poids:</span> {{ pokemon.weight / 10 }} kg</p>
                <p><span class="font-medium">Expérience de base:</span> {{ pokemon.base_experience }}</p>
              </div>

              <!-- Statistiques -->
              <h2 class="text-xl font-semibold mt-8 mb-4">Statistiques</h2>
              <div class="space-y-2">
                <div *ngFor="let stat of pokemon.stats" class="mb-2">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="capitalize">{{ stat.stat.name.replace('-', ' ') }}:</span>
                    <span class="font-medium">{{ stat.base_stat }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      class="bg-blue-600 h-2.5 rounded-full" 
                      [ngStyle]="{'width.%': (stat.base_stat / 255) * 100}"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Capacités -->
            <div>
              <h2 class="text-xl font-semibold mb-4">Capacités</h2>
              <div class="space-y-2">
                <div *ngFor="let ability of pokemon.abilities" class="mb-2">
                  <span class="capitalize">{{ ability.ability.name.replace('-', ' ') }}</span>
                  <span *ngIf="ability.is_hidden" class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                    Cachée
                  </span>
                </div>
              </div>

              <!-- Mouvements -->
              <h2 class="text-xl font-semibold mt-8 mb-4">Mouvements</h2>
              <div class="flex flex-wrap gap-2">
                <span 
                  *ngFor="let move of pokemon.moves.slice(0, 5)" 
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                >
                  {{ move.move.name.replace('-', ' ') }}
                </span>
                <span *ngIf="pokemon.moves.length > 5" class="text-gray-500">+{{ pokemon.moves.length - 5 }} autres</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PokemonDetailComponent implements OnInit {
  pokemon: Pokemon | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPokemon(id);
    } else {
      this.errorMessage = 'Identifiant de Pokémon non spécifié';
      this.isLoading = false;
    }
  }

  loadPokemon(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.pokemonService.getPokemon(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pokemon:', error);
        this.errorMessage = 'Impossible de charger les détails du Pokémon. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }
}
