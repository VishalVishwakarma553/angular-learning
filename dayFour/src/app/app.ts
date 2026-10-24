import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  noWhitespaceValidator,
  passwordMatchValidator,
  usernameAvailabilityValidator,
} from './validators/custom-validators';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { IdPreviewComponent } from './components/id-preview/id-preview.component';

export type SkillLevel = 'junior' | 'mid' | 'senior' | 'lead';

export interface SkillForm {
  name: FormControl<string>;
  level: FormControl<SkillLevel>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent, IdPreviewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Modern NonNullableFormBuilder: values never become null upon form.reset()
  private fb = inject(NonNullableFormBuilder);

  // Submission & Modal state
  isSubmitted = signal<boolean>(false);
  submittedProfile = signal<any | null>(null);

  // === 1. STRICTLY-TYPED REACTIVE FORM TREE ===
  form = this.fb.group(
    {
      fullName: [
        'Vishal Vishwakarma',
        [Validators.required, Validators.minLength(2), noWhitespaceValidator],
      ],
      username: [
        'vishal_dev',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[a-z0-9_]+$/),
        ],
        [usernameAvailabilityValidator()], // Custom Async Validator!
      ],
      email: ['vishal@angular.io', [Validators.required, Validators.email]],
      password: [
        'AngularDev#2026',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/),
        ],
      ],
      confirmPassword: ['AngularDev#2026', [Validators.required]],
      role: ['Staff Frontend Architect', [Validators.required]],
      experienceYears: [5, [Validators.required, Validators.min(0), Validators.max(40)]],
      hourlyRate: [120, [Validators.required, Validators.min(15), Validators.max(500)]],
      bio: [
        'Specializing in Modern Angular, Signal-based reactivity, and micro-frontend design.',
        [Validators.maxLength(200)],
      ],
      availableForHire: [true],
      agreeTerms: [true, [Validators.requiredTrue]],

      // Dynamic FormArray of typed SkillForm groups
      skills: this.fb.array<FormGroup<SkillForm>>([]),
    },
    {
      // Cross-Field Custom Validator (checks password === confirmPassword)
      validators: [passwordMatchValidator],
    }
  );

  // === 2. MODERN BRIDGE: REACTIVE FORM TO SIGNAL ===
  // Automatically transforms RxJS form.valueChanges stream into an Angular Signal!
  readonly liveFormValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  // Derived signals for form status
  readonly isFormPending = computed(() => this.form.status === 'PENDING');
  readonly isFormValid = computed(() => this.form.valid);

  // Roles catalog
  readonly availableRoles = [
    'Staff Frontend Architect',
    'Senior Fullstack Engineer',
    'Angular Solutions Engineer',
    'UI/UX Design Technologist',
    'DevOps & Cloud Engineer',
  ];

  constructor() {
    // Populate default dynamic skills
    this.addSkill('Angular', 'lead');
    this.addSkill('TypeScript', 'senior');
    this.addSkill('Tailwind CSS', 'senior');
    this.addSkill('Signals & RxJS', 'lead');
  }

  // === 3. DYNAMIC FORMARRAY METHODS ===
  get skillsArray() {
    return this.form.controls.skills;
  }

  createSkillGroup(name = '', level: SkillLevel = 'mid'): FormGroup<SkillForm> {
    return this.fb.group<SkillForm>({
      name: this.fb.control(name, [Validators.required, noWhitespaceValidator]),
      level: this.fb.control(level, [Validators.required]),
    });
  }

  addSkill(defaultName = '', defaultLevel: SkillLevel = 'mid'): void {
    this.skillsArray.push(this.createSkillGroup(defaultName, defaultLevel));
  }

  removeSkill(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  // === 4. DEMO HELPERS ===
  fillDemoData(): void {
    this.form.patchValue({
      fullName: 'Alex Rivera',
      username: 'arivera_cloud',
      email: 'alex.rivera@tech.org',
      password: 'CloudMastery#99',
      confirmPassword: 'CloudMastery#99',
      role: 'Senior Fullstack Engineer',
      experienceYears: 7,
      hourlyRate: 145,
      bio: 'Cloud-native fullstack engineer obsessed with performance, signals, and edge computing.',
      availableForHire: true,
      agreeTerms: true,
    });
  }

  fillTakenUsername(): void {
    // Fill with 'admin' to trigger the async validator error!
    this.form.controls.username.setValue('admin');
    this.form.controls.username.markAsTouched();
    this.form.controls.username.markAsDirty();
  }

  fillMismatchedPassword(): void {
    // Fill with different password to trigger cross-field validator!
    this.form.controls.confirmPassword.setValue('Mismatch#123');
    this.form.controls.confirmPassword.markAsTouched();
    this.form.controls.confirmPassword.markAsDirty();
  }

  resetForm(): void {
    this.form.reset();
    this.skillsArray.clear();
    this.addSkill('Angular', 'lead');
    this.addSkill('TypeScript', 'senior');
    this.isSubmitted.set(false);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      // Mark all controls as touched so errors display immediately
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    this.submittedProfile.set(payload);
    this.isSubmitted.set(true);
  }
}
