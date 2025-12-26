import { Injectable, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeColorService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private themeColorMeta: HTMLMetaElement;

  constructor(private meta: Meta) {
    // Créer ou récupérer la balise meta theme-color
    const existingMeta = this.meta.getTag('name="theme-color"');
    if (existingMeta) {
      this.themeColorMeta = existingMeta;
    } else {
      this.themeColorMeta = document.createElement('meta');
      this.themeColorMeta.name = 'theme-color';
      this.themeColorMeta.content = '#3b82f6';
      document.head.appendChild(this.themeColorMeta);
    }
  }

  /**
   * Définit la couleur du thème pour la barre d'adresse sur mobile
   * @param color La couleur au format hexadécimal (ex: #3b82f6)
   */
  setThemeColor(color: string): void {
    this.meta.updateTag({ name: 'theme-color', content: color }, 'name="theme-color"');
  }

  /**
   * Réinitialise la couleur du thème à la valeur par défaut (#3b82f6)
   */
  resetThemeColor(): void {
    this.setThemeColor('#3b82f6');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
