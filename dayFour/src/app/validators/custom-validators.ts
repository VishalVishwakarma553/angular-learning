import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, first } from 'rxjs/operators';

/**
 * Custom Cross-Field Validator:
 * Validates that 'password' and 'confirmPassword' controls have identical values.
 */
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null; // Don't report mismatch until both have been touched/typed
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

/**
 * Custom Synchronous Validator:
 * Ensures string input does not consist solely of whitespace spaces.
 */
export const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { whitespace: true } : null;
};

/**
 * Custom Asynchronous Validator:
 * Simulates a real-world database check to verify if a username is already taken.
 * Triggers status = 'PENDING' for 600ms to allow UI loading spinner demonstration.
 */
export function usernameAvailabilityValidator(): AsyncValidatorFn {
  const takenUsernames = ['admin', 'vishal', 'alex', 'angular', 'root', 'developer'];

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = (control.value || '').toLowerCase().trim();

    if (!username || username.length < 3) {
      // Return immediately if empty or too short (handled by minLength)
      return new Observable((obs) => {
        obs.next(null);
        obs.complete();
      });
    }

    // Simulate network request with 600ms latency
    return timer(600).pipe(
      map(() => {
        if (takenUsernames.includes(username)) {
          return { usernameTaken: { username } };
        }
        return null;
      }),
      first()
    );
  };
}
