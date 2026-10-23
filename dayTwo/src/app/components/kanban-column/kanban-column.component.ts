import { Component, computed, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [TaskCardComponent],
  template: `
    <div class="flex flex-col bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 min-w-[300px] flex-1 backdrop-blur-sm">
      <!-- Column Header -->
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div class="flex items-center gap-2.5">
          <!-- Status Indicator Dot -->
          <span
            class="w-2.5 h-2.5 rounded-full ring-4"
            [class.bg-sky-400]="status() === 'todo'"
            [class.ring-sky-500/20]="status() === 'todo'"
            [class.bg-amber-400]="status() === 'in_progress'"
            [class.ring-amber-500/20]="status() === 'in_progress'"
            [class.bg-purple-400]="status() === 'review'"
            [class.ring-purple-500/20]="status() === 'review'"
            [class.bg-emerald-400]="status() === 'done'"
            [class.ring-emerald-500/20]="status() === 'done'"
          ></span>

          <h3 class="font-bold text-sm tracking-wide text-slate-200">
            {{ title() }}
          </h3>

          <!-- Counter Pill -->
          <span class="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
            {{ tasks().length }}
          </span>
        </div>

        <!-- Quick Add Button in Column Header -->
        <button
          type="button"
          (click)="addTask.emit(status())"
          class="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
          title="Add task to this column"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Card List with Modern Control Flow -->
      <div class="flex-1 flex flex-col gap-3 min-h-[300px] overflow-y-auto pr-0.5">
        @for (item of tasks(); track item.id) {
          <app-task-card
            [task]="item"
            (statusChange)="taskStatusChange.emit($event)"
            (delete)="taskDelete.emit($event)"
            (edit)="taskEdit.emit($event)"
          />
        } @empty {
          <!-- Empty State -->
          <div class="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-800/80 rounded-xl my-2">
            <div class="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mb-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-slate-400">No tasks in this lane</p>
            <button
              type="button"
              (click)="addTask.emit(status())"
              class="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              + Add a task
            </button>
          </div>
        }
      </div>

      <!-- Column Footer: Total hours in lane -->
      <div class="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
        <span>Estimated Effort</span>
        <span class="font-mono text-slate-400 font-semibold">{{ totalHours() }} hrs</span>
      </div>
    </div>
  `,
})
export class KanbanColumnComponent {
  // Signal Inputs
  title = input.required<string>();
  status = input.required<TaskStatus>();
  tasks = input.required<Task[]>();

  // Event Outputs
  taskStatusChange = output<{ id: string; newStatus: TaskStatus }>();
  taskDelete = output<string>();
  taskEdit = output<Task>();
  addTask = output<TaskStatus>();

  // Computed Signal: sum of estimate hours for this lane
  totalHours = computed(() => {
    return this.tasks().reduce((acc, curr) => acc + (curr.estimateHours || 0), 0);
  });
}
