import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <!-- Floating Bottom-Right Toast Stack -->
    <aside aria-label="Notifications" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all transform animate-slide-up"
          [class.bg-slate-900]="true"
          [class.border-emerald-500/40]="toast.type === 'success'"
          [class.border-rose-500/40]="toast.type === 'error'"
          [class.border-amber-500/40]="toast.type === 'warning'"
          [class.border-sky-500/40]="toast.type === 'info'"
        >
          <!-- Icon indicator -->
          <div class="mt-0.5 shrink-0">
            @switch (toast.type) {
              @case ('success') {
                <span class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
              }
              @case ('error') {
                <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold">✕</span>
              }
              @case ('warning') {
                <span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">!</span>
              }
              @default {
                <span class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold">i</span>
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-slate-100 tracking-wide">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">{{ toast.message }}</p>
            }
          </div>

          <!-- Dismiss button -->
          <button
            type="button"
            (click)="toastService.remove(toast.id)"
            class="text-slate-500 hover:text-slate-300 p-1 -mr-1 rounded-lg transition-colors cursor-pointer"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </aside>
  `,
  styles: [`
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .animate-slide-up {
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `],
})
export class ToastContainerComponent {
  // Direct Dependency Injection of ToastService
  readonly toastService = inject(ToastService);
}
