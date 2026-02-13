import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, timer, Subject, fromEvent } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { User, LoginRequest, LoginResponse, RegisterRequest, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_data';
  private readonly INACTIVITY_TIMEOUT = 30000; // 30 secondes au lieu de 5
  private readonly TAB_SYNC_KEY = 'auth_logout';
  private readonly DISABLE_AUTO_LOGOUT = false; // Mettre à true pour désactiver la déconnexion auto

  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    currentUser: null,
    token: null
  });

  private storageEventListener: ((event: StorageEvent) => void) | null = null;
  private inactivityTimer: any = null; // Pour stocker le timer
  private lastActivityTime: number = 0; // Pour éviter les réinitialisations trop fréquentes
  private readonly THROTTLE_DELAY = 2000; // 2 secondes entre les réinitialisations

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuth();
    this.setupInactivityDetection();
    this.setupTabSync();
  }

  private initializeAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedAuth = localStorage.getItem(this.STORAGE_KEY);
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          this.authState$.next(authData);
        } catch (error) {
          console.error('Erreur lors de la lecture des données d\'authentification:', error);
          this.clearAuth();
        }
      }
    }
  }

  private setupInactivityDetection(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Événements considérés comme une activité réelle de l'utilisateur
    const meaningfulEvents = ['mousedown', 'keypress', 'touchstart', 'click'];
    
    meaningfulEvents.forEach(event => {
      document.addEventListener(event, (e) => {
        // Ignorer les événements provenant d'iframes
        if (e.target && (e.target as HTMLElement).tagName === 'IFRAME') {
          return;
        }
        this.resetInactivityTimer();
      }, { 
        passive: true, 
        capture: true 
      });
    });

    // Événements moins prioritaires avec plus de throttling
    const lessImportantEvents = ['mousemove', 'scroll'];
    lessImportantEvents.forEach(event => {
      document.addEventListener(event, (e) => {
        // Ignorer les événements provenant d'iframes
        if (e.target && (e.target as HTMLElement).tagName === 'IFRAME') {
          return;
        }
        this.resetInactivityTimer();
      }, { 
        passive: true 
      });
    });

    // Démarrer le timer initial uniquement si l'utilisateur est connecté
    this.authState$.subscribe(authState => {
      if (authState.isAuthenticated) {
        this.resetInactivityTimer();
      } else {
        // Nettoyer le timer si déconnecté
        if (this.inactivityTimer) {
          clearTimeout(this.inactivityTimer);
          this.inactivityTimer = null;
        }
      }
    });
  }

  private resetInactivityTimer(): void {
    if (isPlatformBrowser(this.platformId) && !this.DISABLE_AUTO_LOGOUT) {
      const now = Date.now();
      
      // Éviter les réinitialisations trop fréquentes (throttling)
      if (now - this.lastActivityTime < this.THROTTLE_DELAY) {
        return;
      }
      
      this.lastActivityTime = now;
      
      // Annuler le timer précédent s'il existe
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      
      // Créer un nouveau timer
      this.inactivityTimer = setTimeout(() => {
        if (this.authState$.value.isAuthenticated) {
          console.log('Déconnexion automatique due à l\'inactivité après', this.INACTIVITY_TIMEOUT / 1000, 'secondes');
          this.logout();
        }
      }, this.INACTIVITY_TIMEOUT);
      
      console.log('Timer d\'inactivité réinitialisé. Déconnexion dans', this.INACTIVITY_TIMEOUT / 1000, 'secondes');
    }
  }

  private setupTabSync(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.storageEventListener = (event: StorageEvent) => {
      if (event.key === this.TAB_SYNC_KEY && event.newValue === 'logout') {
        this.logout(false);
      }
    };

    window.addEventListener('storage', this.storageEventListener);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        console.log('Utilisateurs disponibles:', users);
        console.log('Tentative de connexion avec:', credentials.username);
        
        const user = users.find(u => 
          u.username === credentials.username && 
          u.password === credentials.password &&
          !u.isBlocked
        );

        console.log('Utilisateur trouvé:', user);

        if (user) {
          const token = this.generateToken(user);
          const userResponse = { ...user, password: undefined };
          const loginResponse: LoginResponse = {
            token,
            user: userResponse
          };

          const authState: AuthState = {
            isAuthenticated: true,
            currentUser: userResponse,
            token
          };

          this.authState$.next(authState);
          this.saveAuthToStorage(authState);
          
          observer.next(loginResponse);
          observer.complete();
        } else {
          observer.error(new Error('Identifiants invalides ou utilisateur bloqué'));
        }
      }, 500);
    });
  }

  register(userData: RegisterRequest): Observable<Omit<User, 'password'>> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        console.log('Utilisateurs actuels lors de l\'inscription:', users);
        
        if (users.some(u => u.username === userData.username)) {
          observer.error(new Error('Ce nom d\'utilisateur existe déjà'));
          return;
        }

        if (users.some(u => u.email === userData.email)) {
          observer.error(new Error('Cet email existe déjà'));
          return;
        }

        const newUser: User = {
          id: this.generateId(),
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'user',
          isBlocked: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        users.push(newUser);
        this.saveUsers(users);
        console.log('Nouvel utilisateur créé:', newUser);
        console.log('Liste des utilisateurs après création:', users);

        const userResponse = { ...newUser, password: undefined };
        observer.next(userResponse);
        observer.complete();
      }, 500);
    });
  }

  logout(syncTabs: boolean = true): void {
    console.log('Déconnexion de l\'utilisateur');
    
    // Nettoyer le timer d'inactivité
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    
    this.authState$.next({
      isAuthenticated: false,
      currentUser: null,
      token: null
    });

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
      
      if (syncTabs) {
        localStorage.setItem(this.TAB_SYNC_KEY, 'logout');
        setTimeout(() => {
          localStorage.removeItem(this.TAB_SYNC_KEY);
        }, 100);
      }
    }

    this.router.navigate(['/auth/login']);
  }

  resetPassword(userId: string): Observable<void> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].password = 'password123';
          users[userIndex].updatedAt = new Date();
          this.saveUsers(users);
          observer.next();
          observer.complete();
        } else {
          observer.error(new Error('Utilisateur non trouvé'));
        }
      }, 500);
    });
  }

  toggleUserBlock(userId: string): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getStoredUsers();
        const user = users.find(u => u.id === userId);
        
        if (user) {
          user.isBlocked = !user.isBlocked;
          user.updatedAt = new Date();
          this.saveUsers(users);
          observer.next(user);
          observer.complete();
        } else {
          observer.error(new Error('Utilisateur non trouvé'));
        }
      }, 500);
    });
  }

  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }

  getCurrentUser(): Omit<User, 'password'> | null {
    return this.authState$.value.currentUser;
  }

  isAuthenticated(): boolean {
    return this.authState$.value.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.authState$.value.currentUser?.role === 'admin';
  }

  createAdminUser(): void {
    const users = this.getStoredUsers();
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
      const adminUser: User = {
        id: this.generateId(),
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(adminUser);
      this.saveUsers(users);
      console.log('Utilisateur admin créé avec succès (admin/admin123)');
      console.log('Utilisateurs après création admin:', users);
    } else {
      console.log('Utilisateur admin existe déjà');
      console.log('Utilisateurs actuels:', users);
    }
  }

  private getStoredUsers(): User[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Erreur lors de la lecture des utilisateurs:', error);
        return [];
      }
    }
    return [];
  }

  private saveUsers(users: User[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  private saveAuthToStorage(authState: AuthState): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authState));
    }
  }

  private clearAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 heures
    };
    return btoa(JSON.stringify(payload));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  ngOnDestroy(): void {
    if (this.storageEventListener && isPlatformBrowser(this.platformId)) {
      window.removeEventListener('storage', this.storageEventListener);
    }
  }
}
