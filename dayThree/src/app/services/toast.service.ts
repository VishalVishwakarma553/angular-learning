import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root', // Singleton available throughout the application
})
export class ToastService {
  private destroyRef = inject(DestroyRef);
  private timerMap = new Map<string, any>();

  // 1. Private writable signal (State Encapsulation)
  #toasts = signal<Toast[]>([]);

  // 2. Public Readonly signal (Components can read, but cannot accidentally mutate)
  readonly toasts = this.#toasts.asReadonly();

  constructor() {
    // Automatically clear any scheduled timers on destruction
    this.destroyRef.onDestroy(() => {
      this.timerMap.forEach((timer) => clearTimeout(timer));
      this.timerMap.clear();
    });
  }

  show(title: string, message: string, type: ToastType = 'info', durationMs = 3500): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: Toast = { id, title, message, type, durationMs };

    // Update signal with newest toast at the top, max 5 toasts visible
    this.#toasts.update((current) => [newToast, ...current].slice(0, 5));

    // Schedule auto-dismiss
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        this.remove(id);
      }, durationMs);
      this.timerMap.set(id, timer);
    }

    return id;
  }

  success(title: string, message = ''): void {
    this.show(title, message, 'success');
  }

  error(title: string, message = ''): void {
    this.show(title, message, 'error');
  }

  info(title: string, message = ''): void {
    this.show(title, message, 'info');
  }

  warning(title: string, message = ''): void {
    this.show(title, message, 'warning');
  }

  remove(id: string): void {
    if (this.timerMap.has(id)) {
      clearTimeout(this.timerMap.get(id));
      this.timerMap.delete(id);
    }
    this.#toasts.update((items) => items.filter((t) => t.id !== id));
  }

  clearAll(): void {
    this.timerMap.forEach((timer) => clearTimeout(timer));
    this.timerMap.clear();
    this.#toasts.set([]);
  }
}
  