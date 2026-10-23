import { Component, computed, input, output } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { BadgeComponent, BadgeVariant } from '../badge/badge.component';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [BadgeComponent, RelativeTimePipe],
  template: `
    <div
      class="group relative bg-slate-900/90 hover:bg-slate-800/90 border rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5"
      [class.border-slate-800]="task().priority !== 'urgent'"
      [class.border-rose-800/50]="task().priority === 'urgent'"
      [class.hover:border-slate-700]="task().priority !== 'urgent'"
      [class.hover:border-rose-700/60]="task().priority === 'urgent'"
    >
      <!-- Top meta: Priority badge + Quick Actions -->
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <app-badge [variant]="priorityVariant()" size="sm">
          <span class="w-1.5 h-1.5 rounded-full" [class.bg-rose-400]="task().priority === 'urgent'" [class.bg-amber-400]="task().priority === 'high'" [class.bg-sky-400]="task().priority === 'medium'" [class.bg-slate-400]="task().priority === 'low'"></span>
          <span class="capitalize">{{ task().priority }}</span>
        </app-badge>

        <!-- Action Menu on Card Hover -->
        <div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <!-- Quick Status Select -->
          <select
            [value]="task().status"
            (change)="onStatusSelect($event)"
            class="text-xs bg-slate-950/80 border border-slate-700/80 rounded-md px-1.5 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            title="Move Status"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <!-- Edit button -->
          <button
            type="button"
            (click)="edit.emit(task())"
            class="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Edit Task"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>

          <!-- Delete button -->
          <button
            type="button"
            (click)="delete.emit(task().id)"
            class="p-1 hover:bg-rose-950/60 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Task Title -->
      <h4 class="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 mb-1.5 leading-snug">
        {{ task().title }}
      </h4>

      <!-- Task Description -->
      <p class="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
        {{ task().description }}
      </p>

      <!-- Tags list -->
      @if (task().tags.length > 0) {
        <div class="flex flex-wrap gap-1.5 mb-3.5">
          @for (tag of task().tags; track tag) {
            <span class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
              #{{ tag }}
            </span>
          }
        </div>
      }

      <!-- Bottom Card Footer: Assignee & Time Ago & Estimate -->
      <div class="flex items-center justify-between pt-2.5 border-t border-slate-800/60 text-xs text-slate-400">
        <!-- Assignee Info -->
        <div class="flex items-center gap-2">
          <img
            [src]="task().assignee.avatar"
            [alt]="task().assignee.name"
            class="w-5 h-5 rounded-full ring-1 ring-slate-700 object-cover"
          />
          <span class="text-xs font-medium text-slate-300">{{ task().assignee.name }}</span>
        </div>

        <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <!-- Hours estimate -->
          <span class="flex items-center gap-1" title="Estimate">
            <svg class="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ task().estimateHours }}h
          </span>

          <span class="text-slate-600">•</span>

          <!-- Custom Standalone RelativeTimePipe -->
          <span title="{{ task().createdAt }}">{{ task().createdAt | relativeTime }}</span>
        </div>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  // 1. Modern Signal Input (Required)
  task = input.required<Task>();

  // 2. Modern Signal Outputs
  statusChange = output<{ id: string; newStatus: TaskStatus }>();
  delete = output<string>();
  edit = output<Task>();

  // 3. Computed Signal deriving variant from task's priority signal
  priorityVariant = computed<BadgeVariant>(() => {
    switch (this.task().priority) {
      case 'urgent':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
      default:
        return 'default';
    }
  });

  onStatusSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as TaskStatus;
    if (newStatus !== this.task().status) {
      this.statusChange.emit({
        id: this.task().id,
        newStatus,
      });
    }
  }
}
