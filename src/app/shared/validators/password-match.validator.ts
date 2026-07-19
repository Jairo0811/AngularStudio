import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function passwordMatchValidator(
  passwordControlName: string,
  confirmPasswordControlName: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(
      confirmPasswordControlName,
    );

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const passwordsMatch =
      passwordControl.value === confirmPasswordControl.value;

    if (!passwordsMatch) {
      confirmPasswordControl.setErrors({
        ...confirmPasswordControl.errors,
        passwordMismatch: true,
      });

      return {
        passwordMismatch: true,
      };
    }

    if (confirmPasswordControl.hasError('passwordMismatch')) {
      const currentErrors = {
        ...confirmPasswordControl.errors,
      };

      delete currentErrors['passwordMismatch'];

      confirmPasswordControl.setErrors(
        Object.keys(currentErrors).length > 0
          ? currentErrors
          : null,
      );
    }

    return null;
  };
}