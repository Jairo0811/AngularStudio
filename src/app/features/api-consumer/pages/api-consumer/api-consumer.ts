import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  RandomUser,
} from '../../models/random-user.model';
import {
  RandomUserService,
} from '../../services/random-user.service';

@Component({
  selector: 'app-api-consumer',
  templateUrl: './api-consumer.html',
  styleUrl: './api-consumer.scss',
})
export class ApiConsumer {
  private readonly randomUserService = inject(
    RandomUserService,
  );

  protected readonly users = signal<readonly RandomUser[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly selectedCountry = signal('');
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly countries = computed(() => {
    const uniqueCountries = new Set(
      this.users().map((user) => user.location.country),
    );

    return Array
      .from(uniqueCountries)
      .sort((first, second) =>
        first.localeCompare(second),
      );
  });

  protected readonly filteredUsers = computed(() => {
    const normalizedSearch = this.searchTerm()
      .trim()
      .toLocaleLowerCase();

    const country = this.selectedCountry();

    return this.users().filter((user) => {
      const fullName = this.getFullName(user)
        .toLocaleLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        user.email.toLocaleLowerCase().includes(normalizedSearch) ||
        user.location.city
          .toLocaleLowerCase()
          .includes(normalizedSearch);

      const matchesCountry =
        !country ||
        user.location.country === country;

      return matchesSearch && matchesCountry;
    });
  });

  constructor() {
    void this.loadUsers();
  }

  protected async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await firstValueFrom(
        this.randomUserService.getUsers(30),
      );

      this.users.set(response.results);
    } catch {
      this.users.set([]);
      this.errorMessage.set(
        'No fue posible obtener los usuarios. Comprueba tu conexión e intenta nuevamente.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected updateCountry(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCountry.set(select.value);
  }

  protected clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCountry.set('');
  }

  protected getFullName(user: RandomUser): string {
    return [
      user.name.title,
      user.name.first,
      user.name.last,
    ].join(' ');
  }

  protected trackUser(
    _index: number,
    user: RandomUser,
  ): string {
    return user.login.uuid;
  }
}