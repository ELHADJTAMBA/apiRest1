import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private updates: SwUpdate) {
    if (updates.isEnabled) {
      // Vérifier les mises à jour toutes les 6 heures
      timer(0, 6 * 60 * 60 * 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => updates.checkForUpdate());

      // Gérer les mises à jour disponibles
      updates.versionUpdates
        .pipe(
          filter(evt => evt.type === 'VERSION_READY'),
          map(evt => evt as VersionReadyEvent),
          switchMap(() => {
            // Demander à l'utilisateur de recharger la page
            if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page pour profiter des dernières améliorations ?')) {
              return updates.activateUpdate().then(() => document.location.reload());
            }
            return Promise.resolve();
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();

      // Gérer les erreurs de mise à jour
      updates.unrecoverable
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          console.error('Erreur de mise à jour:', event.reason);
          // Forcer le rechargement en cas d'erreur critique
          document.location.reload();
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
