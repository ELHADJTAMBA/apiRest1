import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, NgFor],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  
  // Informations de contact
  contactInfo = {
    email: 'elhadjtamaba.999@gmail.com',
    socialMedia: [
      { name: 'GitHub', icon: 'github', url: 'https://github.com/votre-username', color: 'hover:text-gray-700' },
      { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/votre-username', color: 'hover:text-blue-400' },
      { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/votre-username', color: 'hover:text-blue-600' },
      { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/votre-username', color: 'hover:text-pink-500' },
      { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/in/votre-username', color: 'hover:text-blue-700' }
    ]
  };
  
  // Fonction pour ouvrir le client de messagerie par défaut
  sendEmail() {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }
}
