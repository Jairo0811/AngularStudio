import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-flags-gallery',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './flags-gallery.html',
  styleUrl: './flags-gallery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlagsGalleryComponent {
  private readonly countryService = inject(CountryService);

  readonly countries = signal<Country[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly selectedRegion = signal('');

  readonly regions = computed(() =>
    [...new Set(this.countries().map((country) => country.region).filter(Boolean))].sort()
  );

  readonly filteredCountries = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const region = this.selectedRegion();

    return this.countries().filter((country) => {
      const searchableValue = [
        country.name.common,
        country.name.official,
        country.cca2,
        country.cca3,
        ...(country.capital ?? [])
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || searchableValue.includes(query);
      const matchesRegion = !region || country.region === region;

      return matchesQuery && matchesRegion;
    });
  });

  constructor() {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.countryService
      .getCountries()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (countries) =>
          this.countries.set(
            [...countries].sort((a, b) =>
              a.name.common.localeCompare(b.name.common)
            )
          ),
        error: () =>
          this.errorMessage.set(
            'No fue posible cargar la galería de países.'
          )
      });
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  updateRegion(value: string): void {
    this.selectedRegion.set(value);
  }

  formatPopulation(value: number): string {
    return new Intl.NumberFormat('es-DO').format(value);
  }
}
