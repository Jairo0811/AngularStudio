import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  protected readonly isSubmitting = signal(false);
  protected readonly emailSent = signal(false);
  protected readonly submittedEmail = signal('');

  protected readonly forgotPasswordForm;

  constructor(private readonly formBuilder: FormBuilder) {
    this.forgotPasswordForm = this.formBuilder.nonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(150),
        ],
      ],
    });
  }

  protected onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { email } = this.forgotPasswordForm.getRawValue();

    window.setTimeout(() => {
      this.submittedEmail.set(email);
      this.emailSent.set(true);
      this.isSubmitting.set(false);
    }, 800);
  }

  protected resetForm(): void {
    this.emailSent.set(false);
    this.submittedEmail.set('');
    this.forgotPasswordForm.reset();
  }
}