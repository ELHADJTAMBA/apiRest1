import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Country, CountryService } from '../../services/country.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-countries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.css']
})
export class CountriesListComponent implements OnInit {
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;
  regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  selectedRegion: string = '';
  private searchTerms = new Subject<string>();

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    // Chargement initial des pays
    this.loadCountries();
    
    // Configuration de la recherche avec debounce
    this.searchTerms.pipe(
      // Attendre 300ms après chaque frappe avant de faire la recherche
      debounceTime(300),
      // Ignorer si le terme de recherche est identique au précédent
      distinctUntilChanged(),
      // Passer à une nouvelle recherche observable à chaque fois que le terme change
      switchMap((term: string) => {
        if (!term.trim()) {
          // Si le terme est vide, afficher tous les pays
          return of(this.countries);
        }
        // Sinon, effectuer une recherche
        return this.countryService.searchCountries(term).pipe(
          catchError(error => {
            console.error('Erreur de recherche:', error);
            return of([]);
          })
        );
      })
    ).subscribe({
      next: (countries) => {
        this.filteredCountries = countries;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.error = 'Une erreur est survenue lors de la recherche.';
      }
    });
  }

  private loadCountries(): void {
    this.isLoading = true;
    this.error = null;
    
    this.countryService.getAllCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filteredCountries = [...this.countries];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pays:', error);
        this.error = 'Impossible de charger la liste des pays. Veuillez vérifier votre connexion Internet et réessayer.';
        this.isLoading = false;
      }
    });
  }

  // Appelée à chaque frappe dans le champ de recherche
  onSearch(): void {
    this.searchTerms.next(this.searchTerm);
  }

  onRegionChange(region: string): void {
    this.selectedRegion = region;
    
    // Si la recherche est en cours, on ne fait rien car la recherche va mettre à jour la liste
    if (this.searchTerm.trim().length > 0) {
      return;
    }
    
    if (!region) {
      this.filteredCountries = [...this.countries];
    } else {
      this.filteredCountries = this.countries.filter(country => 
        country.region === region
      );
    }
  }

  getPopulationString(population: number): string {
    if (population === undefined || population === null) return 'N/A';
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
