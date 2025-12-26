import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Chargement en cours...';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullScreen: boolean = false;

  get sizeClass() {
    return {
      'h-4 w-4 border-2': this.size === 'sm',
      'h-8 w-8 border-4': this.size === 'md',
      'h-16 w-16 border-4': this.size === 'lg',
    };
  }

  get containerClass() {
    return {
      'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50': this.fullScreen,
      'inline-block': !this.fullScreen,
    };
  }
}
