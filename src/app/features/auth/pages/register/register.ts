import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { getFirebaseAuthErrorMessage } from '../../../../core/utils/firebase-auth-error.util';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly showConfirmPassword = signal(false);

  protected readonly isSubmitting = signal(false);
  protected readonly isGoogleSubmitting = signal(false);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly registerForm = this.formBuilder.nonNullable.group(
    {
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
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
          Validators.minLength(8),
          Validators.maxLength(100),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      acceptTerms: [
        false,
        Validators.requiredTrue,
      ],
    },
    {
      validators: passwordMatchValidator(
        'password',
        'confirmPassword',
      ),
    },
  );

  protected togglePasswordVisibility(): void {
    this.showPassword.update(
      (currentValue) => !currentValue,
    );
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(
      (currentValue) => !currentValue,
    );
  }

  protected async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      const {
        fullName,
        email,
        password,
      } = this.registerForm.getRawValue();

      await this.authService.register({
        fullName,
        email,
        password,
      });

      await this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      this.errorMessage.set(
        getFirebaseAuthErrorMessage(error),
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async registerWithGoogle(): Promise<void> {
    this.errorMessage.set(null);
    this.isGoogleSubmitting.set(true);

    try {
      await this.authService.loginWithGoogle();

      await this.router.navigate(['/dashboard']);
    } catch (error: unknown) {
      this.errorMessage.set(
        getFirebaseAuthErrorMessage(error),
      );
    } finally {
      this.isGoogleSubmitting.set(false);
    }
  }
}