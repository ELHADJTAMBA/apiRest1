import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[url('https://tailwindcss.com/_next/static/media/hero-dark@90.49d8b1e2.jpg')] bg-cover bg-center"></div>
      </div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Explorez le monde et les Pokémons
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Découvrez des informations détaillées sur les pays du monde et plongez dans l'univers fascinant des Pokémons.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a 
              routerLink="/countries" 
              class="btn btn-primary inline-flex items-center px-6 py-3 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explorer les pays
            </a>
            <a 
              routerLink="/pokemons"
              class="btn bg-yellow-400 hover:bg-yellow-500 text-gray-900 inline-flex items-center px-6 py-3 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Découvrir les Pokémons
            </a>
            <a 
              *ngIf="(authState$ | async)?.isAuthenticated && isAdmin()"
              routerLink="/users/users"
              class="btn bg-purple-600 hover:bg-purple-700 text-white inline-flex items-center px-6 py-3 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Gérer les utilisateurs
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Ce que vous pouvez faire</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <!-- Feature 1 -->
          <div class="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-center">Explorer les pays</h3>
            <p class="text-gray-600 text-center">Découvrez des informations détaillées sur tous les pays du monde, y compris les drapeaux, les capitales, les populations et bien plus encore.</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-center">Découvrir les Pokémons</h3>
            <p class="text-gray-600 text-center">Explorez le monde des Pokémons avec des détails complets sur leurs types, compétences, statistiques et évolutions.</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-6 rounded-xl bg-gray-50 hover:shadow-lg transition-shadow duration-300">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-center">Sécurité garantie</h3>
            <p class="text-gray-600 text-center">Profitez d'une expérience sécurisée et fluide avec des données actualisées en temps réel et une interface intuitive.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer ?</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'utilisateurs qui explorent déjà le monde et l'univers Pokémon avec notre plateforme.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a 
            routerLink="/countries" 
            class="btn btn-primary px-8 py-3 text-lg"
          >
            Explorer maintenant
          </a>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class HomeComponent {
  authState$: Observable<any>;

  constructor(private authService: AuthService) {
    this.authState$ = this.authService.getAuthState();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
