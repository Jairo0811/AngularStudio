import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { getFirebaseAuthErrorMessage } from '../../core/utils/firebase-auth-error.util';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.authService.user;
  protected readonly isLoggingOut = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isMobileMenuOpen = signal(false);

  protected get userInitials(): string {
    const user = this.user();
    const value = user?.displayName ?? user?.email ?? 'Usuario';

    return value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    this.closeMobileMenu();
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    if (window.innerWidth > 760) {
      this.closeMobileMenu();
    }
  }

  protected async logout(): Promise<void> {
    this.errorMessage.set(null);
    this.isLoggingOut.set(true);

    try {
      await this.authService.logout();
      this.closeMobileMenu();
      await this.router.navigate(['/login']);
    } catch (error: unknown) {
      this.errorMessage.set(getFirebaseAuthErrorMessage(error));
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}