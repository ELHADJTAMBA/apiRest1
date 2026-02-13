import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { ThemeColorService } from './core/services/theme-color.service';
import { AuthService } from './core/services/auth.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

declare let window: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Météo des Pays';
  private destroy$ = new Subject<void>();
  private isMobile = false;

  constructor(
    private router: Router,
    private themeColorService: ThemeColorService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    // Créer l'utilisateur admin au démarrage
    this.authService.createAdminUser();

    // Écouter les changements de route pour mettre à jour la couleur du thème
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateThemeColor();
    });

    // Détecter le mode sombre du système
    if (isPlatformBrowser(this.platformId)) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.updateThemeColor(darkModeMediaQuery.matches);
      
      const handleColorSchemeChange = (event: MediaQueryListEvent) => {
        this.updateThemeColor(event.matches);
      };
      
      // Gérer la compatibilité des navigateurs
      if ('addEventListener' in darkModeMediaQuery) {
        darkModeMediaQuery.addEventListener('change', handleColorSchemeChange);
      } else {
        (darkModeMediaQuery as any).addListener(handleColorSchemeChange);
      }
    }
  }

  // Vérifier si l'appareil est un mobile
  private checkIfMobile(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (this.isMobile) {
        this.document.body.classList.add('mobile-device');
      }
    }
  }

  // Mettre à jour la couleur du thème en fonction de la page actuelle
  private updateThemeColor(isDarkMode: boolean = false): void {
    if (isDarkMode) {
      this.themeColorService.setThemeColor('#1e3a8a'); // Bleu foncé pour le mode sombre
    } else {
      this.themeColorService.setThemeColor('#3b82f6'); // Bleu par défaut
    }
  }

  // Gérer les événements tactiles pour éviter le zoom non désiré
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isMobile) {
      // Empêcher le zoom avec deux doigts
      if ((event as any).touches && (event as any).touches.length > 1) {
        event.preventDefault();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
