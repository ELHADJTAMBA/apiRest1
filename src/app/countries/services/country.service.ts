import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError, of, tap } from 'rxjs';

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca2: string;
  cca3: string;
  cioc?: string; // Code CIO (Comité International Olympique)
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  region: string;
  subregion?: string;
  capital?: string[];
  population: number;
  area?: number;
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  latlng: number[];
  timezones: string[];
  borders?: string[];
  flag?: string; // Pour la rétrocompatibilité
  [key: string]: any; // Pour les propriétés supplémentaires non typées
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  // Utilisation de l'API REST Countries v3.1 (version la plus récente)
  private readonly apiUrl = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) {}

  // Récupérer tous les pays
  getAllCountries(): Observable<Country[]> {
    const url = `${this.apiUrl}/all?fields=name,cca2,cca3,flags,region,subregion,capital,population`;
    
    console.log('🔍 Tentative de chargement des pays depuis:', url);
    
    return this.http.get<Country[]>(url).pipe(
      tap({
        next: (countries) => {
          console.log(`✅ Réponse reçue - ${countries?.length || 0} pays chargés`);
          if (countries?.length > 0) {
            console.log('Exemple de pays reçu:', {
              name: countries[0].name,
              cca3: countries[0].cca3,
              region: countries[0].region,
              flags: countries[0].flags
            });
          }
        },
        error: (error) => {
          console.error('❌ Erreur lors de la requête:', error);
          if (error.error) {
            console.error('Détails de l\'erreur:', JSON.stringify(error.error, null, 2));
          }
          if (error.status) {
            console.error(`Code d'erreur HTTP: ${error.status}`);
          }
        }
      }),
      map((countries) => {
        if (!countries || !Array.isArray(countries)) {
          console.error('❌ La réponse de l\'API est invalide:', countries);
          return [];
        }
        
        console.log(`Nombre total de pays reçus: ${countries.length}`);
        
        // Filtrer les pays invalides
        const validCountries = countries.filter(country => {
          const isValid = country && 
                        country.name && 
                        country.name.common && 
                        country.cca3 &&
                        country.flags?.png;
          
          if (!isValid) {
            console.warn('Pays invalide ignoré:', country);
          }
          
          return isValid;
        });
        
        console.log(`✅ ${validCountries.length} pays valides sur ${countries.length} reçus`);
        
        // Trier par nom
        const sortedCountries = [...validCountries].sort((a, b) => 
          a.name.common.localeCompare(b.name.common, 'fr', {sensitivity: 'base'})
        );
        
        console.log('Pays triés (premiers):', sortedCountries.slice(0, 3).map(c => c.name.common));
        
        return sortedCountries;
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération des pays:', error);
        
        // Essayer une URL alternative en cas d'échec
        console.log('Tentative avec une URL alternative...');
        const altUrl = 'https://restcountries.com/v2/all?fields=name,alpha3Code,flags,region,subregion,capital,population';
        
        return this.http.get<any[]>(altUrl).pipe(
          map(altCountries => {
            console.log(`Récupération de ${altCountries?.length || 0} pays depuis l'API v2`);
            
            return (altCountries || []).map(country => ({
              name: {
                common: country.name,
                official: country.name
              },
              cca3: country.alpha3Code,
              flags: {
                png: country.flags?.png || '',
                svg: country.flags?.svg || ''
              },
              region: country.region,
              subregion: country.subregion,
              capital: country.capital ? [country.capital] : [],
              population: country.population || 0
            } as Country));
          }),
          catchError(altError => {
            console.error('❌ Échec de la récupération alternative:', altError);
            return of([]);
          })
        );
      })
    );
  }

  // Rechercher un pays par son nom
  searchCountries(searchTerm: string): Observable<Country[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return of([]);
    }
    
    const url = `${this.apiUrl}/name/${encodeURIComponent(searchTerm.trim())}?fields=name,cca2,cca3,flags,region,capital,population`;
    
    console.log(`🔍 Recherche de pays avec le terme: ${searchTerm}`);
    
    return this.http.get<Country[]>(url).pipe(
      tap({
        next: (countries) => {
          console.log(`🔍 ${countries?.length || 0} pays trouvés pour "${searchTerm}"`);
        },
        error: (error) => {
          console.error(`❌ Erreur lors de la recherche pour "${searchTerm}":`, error);
        }
      }),
      map(countries => {
        if (!Array.isArray(countries)) {
          return [];
        }
        return countries.sort((a, b) => 
          a.name.common.localeCompare(b.name.common, 'fr', {sensitivity: 'base'})
        );
      }),
      catchError(error => {
        // En cas d'erreur (y compris 404), retourner un tableau vide
        return of([]);
      })
    );
  }

  // Récupérer un pays par son code
  getCountryByCode(code: string): Observable<Country> {
    const url = `${this.apiUrl}/alpha/${code}`;
    
    return this.http.get<Country[]>(url).pipe(
      map(response => response[0]) // L'API retourne un tableau avec un seul élément
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API:', error);
    let errorMessage = 'Une erreur est survenue lors de la récupération des données';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée';
      } else if (error.status >= 500) {
        errorMessage = 'Le serveur rencontre actuellement des difficultés. Veuillez réessayer plus tard.';
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
