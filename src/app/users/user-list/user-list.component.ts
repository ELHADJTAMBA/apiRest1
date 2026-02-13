import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    
    // Simulation de chargement depuis le localStorage
    setTimeout(() => {
      try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
          this.users = JSON.parse(storedUsers);
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
      }
      this.isLoading = false;
    }, 500);
  }

  toggleBlockUser(userId: string): void {
    this.authService.toggleUserBlock(userId).subscribe({
      next: (updatedUser) => {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
          this.users[userIndex] = updatedUser;
        }
        this.successMessage = `Utilisateur ${updatedUser.isBlocked ? 'bloqué' : 'débloqué'} avec succès`;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erreur lors du blocage/déblocage';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  resetPassword(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ?')) {
      this.authService.resetPassword(userId).subscribe({
        next: () => {
          this.successMessage = 'Mot de passe réinitialisé avec succès (password123)';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erreur lors de la réinitialisation';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
