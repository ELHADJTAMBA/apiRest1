import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RainDrop {
  left: number;
  delay: number;
  duration: number;
}

interface SnowFlake {
  left: number;
  delay: number;
  duration: number;
  size: number;
}

@Component({
  selector: 'app-weather-animation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="weather-icon" [ngClass]="getWeatherClass()" [style.width.px]="size" [style.height.px]="size">
      <!-- Soleil -->
      <div class="sun" *ngIf="isSunny">
        <div class="ray-box">
          <div class="ray ray1"></div>
          <div class="ray ray2"></div>
          <div class="ray ray3"></div>
          <div class="ray ray4"></div>
          <div class="ray ray5"></div>
          <div class="ray ray6"></div>
          <div class="ray ray7"></div>
          <div class="ray ray8"></div>
        </div>
      </div>
      
      <!-- Nuages -->
      <div class="cloud" *ngIf="isCloudy"></div>
      <div class="cloud" *ngIf="isCloudy" style="left: 20px; top: 15px; transform: scale(0.8);"></div>
      
      <!-- Pluie -->
      <div class="rain" *ngIf="isRaining">
        <span *ngFor="let drop of rainDrops" [ngStyle]="{
          left: drop.left + 'px',
          animationDelay: drop.delay + 's',
          animationDuration: drop.duration + 's'
        }"></span>
      </div>
      
      <!-- Neige -->
      <div class="snow" *ngIf="isSnowing">
        <span *ngFor="let flake of snowFlakes" [ngStyle]="{
          left: flake.left + 'px',
          animationDelay: flake.delay + 's',
          animationDuration: flake.duration + 's',
          fontSize: flake.size + 'px'
        }">❄</span>
      </div>
      
      <!-- Orage -->
      <div class="lightning" *ngIf="isThunder">
        <div class="bolt"></div>
        <div class="bolt"></div>
      </div>
    </div>
  `,
  styles: [`
    .weather-icon {
      position: relative;
      margin: 0 auto;
      transform: scale(0.8);
    }
    
    /* Soleil */
    .sun {
      position: absolute;
      width: 50%;
      height: 50%;
      left: 25%;
      top: 25%;
      background: #FFD700;
      border-radius: 50%;
      box-shadow: 0 0 40px 5px #FFD700, 0 0 60px 20px #FFD700;
      animation: pulse 2s infinite alternate;
    }
    
    .ray-box {
      position: absolute;
      width: 100%;
      height: 100%;
      animation: rotate 20s linear infinite;
    }
    
    .ray {
      position: absolute;
      left: 50%;
      top: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, #FFD700 50%, rgba(255,255,255,0) 100%);
      transform-origin: 50% 100%;
    }
    
    .ray1 { transform: rotate(0deg); }
    .ray2 { transform: rotate(45deg); }
    .ray3 { transform: rotate(90deg); }
    .ray4 { transform: rotate(135deg); }
    .ray5 { transform: rotate(180deg); }
    .ray6 { transform: rotate(225deg); }
    .ray7 { transform: rotate(270deg); }
    .ray8 { transform: rotate(315deg); }
    
    /* Nuages */
    .cloud {
      position: absolute;
      width: 50px;
      height: 30px;
      background: #fff;
      border-radius: 50px;
      box-shadow: 0 0 10px rgba(255,255,255,0.5);
      animation: float 8s infinite ease-in-out;
    }
    
    .cloud:before, .cloud:after {
      content: '';
      position: absolute;
      background: #fff;
      border-radius: 50%;
    }
    
    .cloud:before {
      width: 25px;
      height: 25px;
      top: -15px;
      left: 10px;
    }
    
    .cloud:after {
      width: 15px;
      height: 15px;
      top: -10px;
      right: 10px;
    }
    
    /* Pluie */
    .rain {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .rain span {
      position: absolute;
      bottom: 50%;
      width: 2px;
      height: 15px;
      background: #7DB3E8;
      border-radius: 0 0 5px 5px;
      animation: rain 0.7s linear infinite;
    }
    
    /* Neige */
    .snow {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .snow span {
      position: absolute;
      top: -20px;
      color: #fff;
      opacity: 0.8;
      animation: snow 5s linear infinite;
    }
    
    /* Orage */
    .lightning {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    
    .bolt {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-top: 30px solid #FFD700;
      transform: translate(-50%, -50%) rotate(-30deg);
      opacity: 0;
      animation: lightning 3s infinite;
    }
    
    .bolt:nth-child(2) {
      animation-delay: 1.5s;
    }
    
    /* Animations */
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      from { box-shadow: 0 0 40px 5px #FFD700, 0 0 60px 20px #FFD700; }
      to { box-shadow: 0 0 50px 10px #FFD700, 0 0 70px 30px #FFD700; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes rain {
      0% { transform: translateY(-50%) translateX(0); opacity: 1; }
      100% { transform: translateY(100%) translateX(20px); opacity: 0; }
    }
    
    @keyframes snow {
      0% { transform: translateY(0) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(100%) rotate(360deg); opacity: 0; }
    }
    
    @keyframes lightning {
      0%, 100% { opacity: 0; }
      1%, 3% { opacity: 1; }
      2% { opacity: 0.5; }
    }
  `]
})
export class WeatherAnimationComponent implements OnChanges {
  @Input() weatherCode: number | undefined;
  @Input() size: number = 100;
  
  // États météorologiques
  isSunny = false;
  isCloudy = false;
  isRaining = false;
  isSnowing = false;
  isThunder = false;
  
  // Gouttes de pluie
  rainDrops: RainDrop[] = [];
  
  // Flocons de neige
  snowFlakes: SnowFlake[] = [];
  
  constructor() {
    this.generateRainDrops();
    this.generateSnowFlakes();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['weatherCode']) {
      this.updateWeatherState();
    }
    
    if (changes['size']) {
      this.generateRainDrops();
      this.generateSnowFlakes();
    }
  }
  
  private updateWeatherState() {
    if (!this.weatherCode) {
      this.resetWeatherState();
      return;
    }
    
    // Réinitialiser tous les états
    this.resetWeatherState();
    
    // Déterminer l'état météorologique en fonction du code
    const mainCategory = Math.floor(this.weatherCode / 100);
    
    switch (mainCategory) {
      case 2: // Orage
        this.isThunder = true;
        this.isRaining = true;
        break;
      case 3: // Bruine
      case 5: // Pluie
        this.isRaining = true;
        this.isCloudy = true;
        break;
      case 6: // Neige
        this.isSnowing = true;
        this.isCloudy = true;
        break;
      case 7: // Brouillard, brume, etc.
        this.isCloudy = true;
        break;
      case 8: // Nuages
        if (this.weatherCode === 800) {
          this.isSunny = true;
        } else {
          this.isCloudy = true;
          if (this.weatherCode <= 802) {
            this.isSunny = true; // Partiellement nuageux
          }
        }
        break;
      default:
        this.isSunny = true; // Par défaut, afficher le soleil
        break;
    }
  }
  
  private resetWeatherState() {
    this.isSunny = false;
    this.isCloudy = false;
    this.isRaining = false;
    this.isSnowing = false;
    this.isThunder = false;
  }
  
  private generateRainDrops() {
    this.rainDrops = [];
    const dropCount = 20;
    
    for (let i = 0; i < dropCount; i++) {
      this.rainDrops.push({
        left: Math.random() * this.size,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 0.5
      });
    }
  }
  
  private generateSnowFlakes() {
    this.snowFlakes = [];
    const flakeCount = 15;
    
    for (let i = 0; i < flakeCount; i++) {
      this.snowFlakes.push({
        left: Math.random() * this.size,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 5,
        size: 10 + Math.random() * 10
      });
    }
  }
  
  getWeatherClass(): string {
    if (this.isThunder) return 'thunder';
    if (this.isSnowing) return 'snowy';
    if (this.isRaining) return 'rainy';
    if (this.isCloudy && this.isSunny) return 'partly-cloudy';
    if (this.isCloudy) return 'cloudy';
    return 'sunny';
  }
}
