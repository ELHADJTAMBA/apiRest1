import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { WeatherAnimationComponent } from './components/weather-animation/weather-animation.component';

const COMPONENTS = [
  ErrorMessageComponent,
  LoadingSpinnerComponent,
  WeatherAnimationComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule
  ],
  exports: [...COMPONENTS]
})
export class SharedModule { }
