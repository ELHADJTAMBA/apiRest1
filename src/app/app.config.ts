import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { of } from 'rxjs';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { httpInterceptor } from './core/services/http.service';
import { provideServiceWorker, SwUpdate } from '@angular/service-worker';

// Configuration du Service Worker
const swRegistrationOptions = {
  enabled: !isDevMode(),
  // S'enregistrer immédiatement, mais attendre que l'application soit stable
  registrationStrategy: 'registerWhenStable:30000'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true
    }), 
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([httpInterceptor]),
      withFetch()
    ), 
    provideServiceWorker('ngsw-worker.js', swRegistrationOptions),
    {
      provide: APP_INITIALIZER,
      useFactory: (swUpdate: SwUpdate) => () => {
        if (swUpdate.isEnabled) {
          return swUpdate.checkForUpdate();
        }
        return of(null);
      },
      deps: [SwUpdate],
      multi: true
    }
  ]
};
