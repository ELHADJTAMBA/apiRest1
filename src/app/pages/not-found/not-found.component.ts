import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-6">Page non trouvée</h2>
        <p class="text-gray-600 mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a 
          routerLink="/" 
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {}
