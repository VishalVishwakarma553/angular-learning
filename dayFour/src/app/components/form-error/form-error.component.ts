import { Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  template: `
    @if (errorMessage()) {
      <div class="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-1.5 animate-slide-in">
        <svg class="w-3.5 h-3.5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage() }}</span>
      </div>
    }
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-in {
      animation: slideIn 0.15s ease-out forwards;
    }
  `]
})
export class FormErrorComponent {
  control = input<AbstractControl | null>(null);
  fieldName = input<string>('This field');

  errorMessage = computed(() => {
    const c = this.control();
    if (!c || !c.errors || !(c.dirty || c.touched)) {
      return null;
    }

    const errors = c.errors;
    const name = this.fieldName();

    if (errors['required'] || errors['requiredTrue']) {
      return `${name} is required.`;
    }
    if (errors['email']) {
      return `Please enter a valid email address.`;
    }
    if (errors['minlength']) {
      return `${name} must be at least ${errors['minlength'].requiredLength} characters.`;
    }
    if (errors['maxlength']) {
      return `${name} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }
    if (errors['usernameTaken']) {
      return `Username "${errors['usernameTaken'].username}" is already taken. Try another!`;
    }
    if (errors['passwordMismatch']) {
      return `Passwords do not match.`;
    }
    if (errors['whitespace']) {
      return `${name} cannot be empty or only spaces.`;
    }
    if (errors['pattern']) {
      return `${name} does not meet required format.`;
    }
    if (errors['min']) {
      return `${name} must be at least ${errors['min'].min}.`;
    }
    if (errors['max']) {
      return `${name} cannot exceed ${errors['max'].max}.`;
    }

    return `${name} is invalid.`;
  });
}
