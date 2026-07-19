import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { getFirebaseAuthErrorMessage } from '../../../../core/utils/firebase-auth-error.util';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly isGoogleSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(150),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ],
    ],
    rememberMe: [false],
  });

  protected togglePasswordVisibility(): void {
    this.showPassword.update((currentValue) => !currentValue);
  }

  protected async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      await this.authService.login(this.loginForm.getRawValue());
      await this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      this.errorMessage.set(getFirebaseAuthErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async loginWithGoogle(): Promise<void> {
    this.errorMessage.set(null);
    this.isGoogleSubmitting.set(true);

    try {
      await this.authService.loginWithGoogle();
      await this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      this.errorMessage.set(getFirebaseAuthErrorMessage(error));
    } finally {
      this.isGoogleSubmitting.set(false);
    }
  }
}