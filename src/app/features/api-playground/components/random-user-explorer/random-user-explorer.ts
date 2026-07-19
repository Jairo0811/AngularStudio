import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { RandomUser } from '../../models/random-user.model';
import { RandomUserService } from '../../services/random-user.service';

@Component({
  selector: 'app-random-user-explorer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './random-user-explorer.html',
  styleUrl: './random-user-explorer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RandomUserExplorerComponent {
  private readonly randomUserService = inject(RandomUserService);

  readonly users = signal<RandomUser[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly searchTerm = signal('');
  readonly selectedCountry = signal('');
  readonly page = signal(1);

  readonly countries = computed(() =>
    [...new Set(this.users().map((user) => user.location.country))].sort()
  );

  readonly filteredUsers = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const country = this.selectedCountry();

    return this.users().filter((user) => {
      const searchableValue = [
        user.name.first,
        user.name.last,
        user.email,
        user.location.city,
        user.location.country
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery = !query || searchableValue.includes(query);
      const matchesCountry = !country || user.location.country === country;

      return matchesQuery && matchesCountry;
    });
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.randomUserService
      .getUsers(24, this.page())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.users.set(response.results),
        error: () =>
          this.errorMessage.set(
            'No fue posible cargar los usuarios. Inténtalo nuevamente.'
          )
      });
  }

  reloadUsers(): void {
    this.page.update((currentPage) => currentPage + 1);
    this.loadUsers();
  }

  updateSearch(value: string): void {
    this.searchTerm.set(value);
  }

  updateCountry(value: string): void {
    this.selectedCountry.set(value);
  }
}
