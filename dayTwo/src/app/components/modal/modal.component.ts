import { Component, HostListener, model, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        (click)="onBackdropClick($event)"
      >
        <!-- Modal Card Container -->
        <div
          class="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-scale-up"
          (click)="$event.stopPropagation()"
        >
          <!-- Header (Slot for Title & Subtitle) -->
          <div class="px-6 py-5 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/50">
            <div>
              <h3 class="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ng-content select="[modal-title]" />
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">
                <ng-content select="[modal-subtitle]" />
              </p>
            </div>
            
            <!-- Close Button -->
            <button
              type="button"
              (click)="close()"
              class="text-slate-400 hover:text-slate-100 hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body Content (Default Slot) -->
          <div class="px-6 py-5 overflow-y-auto space-y-4 text-slate-200">
            <ng-content />
          </div>

          <!-- Footer Actions (Slot for Action Buttons) -->
          <div class="px-6 py-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-end gap-3">
            <ng-content select="[modal-actions]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
    .animate-scale-up {
      animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ModalComponent {
  // Two-way binding signal: creates both input and output for [(isOpen)]
  isOpen = model<boolean>(false);

  // Optional event if consumer wants to hook into close
  closed = output<void>();

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
