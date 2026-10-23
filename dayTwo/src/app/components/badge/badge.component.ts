import { Component, input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 font-medium rounded-full transition-all"
      [class.px-2]="size() === 'sm'"
      [class.py-0.5]="size() === 'sm'"
      [class.text-xs]="size() === 'sm'"
      [class.px-2.5]="size() === 'md'"
      [class.py-1]="size() === 'md'"
      [class.text-sm]="size() === 'md'"
      [class.bg-slate-800]="variant() === 'default'"
      [class.text-slate-300]="variant() === 'default'"
      [class.border]="true"
      [class.border-slate-700]="variant() === 'default'"
      [class.bg-emerald-950/60]="variant() === 'success'"
      [class.text-emerald-300]="variant() === 'success'"
      [class.border-emerald-800/60]="variant() === 'success'"
      [class.bg-amber-950/60]="variant() === 'warning'"
      [class.text-amber-300]="variant() === 'warning'"
      [class.border-amber-800/60]="variant() === 'warning'"
      [class.bg-rose-950/60]="variant() === 'danger'"
      [class.text-rose-300]="variant() === 'danger'"
      [class.border-rose-800/60]="variant() === 'danger'"
      [class.bg-sky-950/60]="variant() === 'info'"
      [class.text-sky-300]="variant() === 'info'"
      [class.border-sky-800/60]="variant() === 'info'"
      [class.bg-purple-950/60]="variant() === 'purple'"
      [class.text-purple-300]="variant() === 'purple'"
      [class.border-purple-800/60]="variant() === 'purple'"
    >
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  size = input<'sm' | 'md'>('sm');
}
