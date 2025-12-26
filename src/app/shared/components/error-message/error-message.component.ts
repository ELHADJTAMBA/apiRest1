import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent {
  @Input() message: string = 'Une erreur est survenue';
  @Input() type: 'error' | 'warning' | 'info' | 'success' = 'error';
  @Input() showIcon: boolean = true;
  @Input() fullWidth: boolean = false;

  get containerClasses() {
    return {
      'bg-red-50 text-red-700 border-red-200': this.type === 'error',
      'bg-yellow-50 text-yellow-700 border-yellow-200': this.type === 'warning',
      'bg-blue-50 text-blue-700 border-blue-200': this.type === 'info',
      'bg-green-50 text-green-700 border-green-200': this.type === 'success',
      'w-full': this.fullWidth,
    };
  }

  get icon() {
    switch (this.type) {
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
      case 'info':
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return '';
    }
  }
}
