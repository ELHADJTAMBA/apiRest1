import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../src/environments/environment';

export interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
    sea_level?: number;
    grnd_level?: number;
    temp_kf?: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
    [key: string]: any;
  };
  visibility: number;
  name: string;
  sys: {
    country: string;
    sunrise?: number;
    sunset?: number;
    [key: string]: any;
  };
  dt: number;
  timezone: number;
  id?: number;
  cod?: number | string;
  base?: string;
  coord?: {
    lon: number;
    lat: number;
  };
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly apiUrl = environment.openWeatherApi;
  private readonly apiKey = environment.weatherApiKey;

  constructor(private http: HttpClient) {}

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    const url = `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=fr`;
    
    return this.http.get<WeatherData>(url).pipe(
      catchError(this.handleError)
    );
  }

  getWeatherByCity(city: string): Observable<WeatherData> {
    const url = `${this.apiUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=fr`;
    
    return this.http.get<WeatherData>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
