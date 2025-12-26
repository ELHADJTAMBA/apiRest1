import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  isMobileView = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Vérifier si on est dans un environnement navigateur
    if (typeof window !== 'undefined') {
      this.checkScreenSize();
    } else {
      // Valeur par défaut pour le rendu côté serveur
      this.isMobileView = false;
    }
  }

  private checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth < 768; // md breakpoint
      if (!this.isMobileView) {
        this.isMenuOpen = false;
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    if (this.isMobileView) {
      this.isMenuOpen = false;
    }
  }
}
