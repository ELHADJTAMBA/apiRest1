import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, filter } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getAuthState().pipe(
      filter(authState => authState !== null), // Attendre que l'état soit initialisé
      take(1),
      map(authState => {
        console.log('AuthGuard - État d\'authentification:', authState);
        
        if (authState.isAuthenticated && authState.currentUser) {
          if (authState.currentUser.isBlocked) {
            console.log('AuthGuard - Utilisateur bloqué, redirection vers login');
            this.router.navigate(['/auth/login']);
            return false;
          }
          console.log('AuthGuard - Accès autorisé');
          return true;
        } else {
          console.log('AuthGuard - Non authentifié, redirection vers login');
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}
