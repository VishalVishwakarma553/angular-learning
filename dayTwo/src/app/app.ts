import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnConfig, Task, TaskPriority, TaskStatus } from './models/task.model';
import { KanbanColumnComponent } from './components/kanban-column/kanban-column.component';
import { ModalComponent } from './components/modal/modal.component';
import { BadgeComponent } from './components/badge/badge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, KanbanColumnComponent, ModalComponent, BadgeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // === 1. TOP-LEVEL STATE (Signals) ===
  searchQuery = signal<string>('');
  priorityFilter = signal<'all' | TaskPriority>('all');
  assigneeFilter = signal<string>('all');

  // Modal State for Two-Way Binding: [(isOpen)]="isModalOpen"
  isModalOpen = signal<boolean>(false);
  editingTaskId = signal<string | null>(null);

  // Form Fields for Create / Edit
  formTitle = signal<string>('');
  formDescription = signal<string>('');
  formStatus = signal<TaskStatus>('todo');
  formPriority = signal<TaskPriority>('medium');
  formAssigneeName = signal<string>('Alex Chen');
  formEstimate = signal<number>(4);
  formTagsString = signal<string>('frontend, angular');

  // Predefined Team Members
  teamMembers = [
    {
      name: 'Alex Chen',
      role: 'Staff Frontend Eng',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Sarah Connor',
      role: 'Fullstack Architect',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Devin Vance',
      role: 'DevOps Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      name: 'Priya Patel',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
    },
  ];

  // Column Configurations
  columns: ColumnConfig[] = [
    { id: 'todo', title: 'To Do', accentColor: 'sky', description: 'Pending implementation' },
    { id: 'in_progress', title: 'In Progress', accentColor: 'amber', description: 'Actively in development' },
    { id: 'review', title: 'In Review', accentColor: 'purple', description: 'Peer & QA verification' },
    { id: 'done', title: 'Completed', accentColor: 'emerald', description: 'Shipped to production' },
  ];

  // Primary Tasks Signal
  tasks = signal<Task[]>([
    {
      id: 'task-1',
      title: 'Migrate legacy @Input decorators to signal input()',
      description: 'Replace obsolete @Input bindings with Angular 19 input.required() and input() for signal graph reactivity.',
      status: 'in_progress',
      priority: 'urgent',
      assignee: this.teamMembers[0],
      estimateHours: 6,
      tags: ['angular', 'signals', 'refactor'],
      createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45m ago
    },
    {
      id: 'task-2',
      title: 'Build multi-slot Modal with <ng-content>',
      description: 'Create reusable dialog wrapper utilizing named slot projections [modal-title] and [modal-actions].',
      status: 'done',
      priority: 'high',
      assignee: this.teamMembers[1],
      estimateHours: 4,
      tags: ['ui', 'components', 'slots'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3h ago
    },
    {
      id: 'task-3',
      title: 'Implement standalone RelativeTimePipe',
      description: 'Transform dates to readable human strings without polluting view logic or adding bloated libraries.',
      status: 'done',
      priority: 'medium',
      assignee: this.teamMembers[3],
      estimateHours: 2,
      tags: ['pipes', 'standalone'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h ago
    },
    {
      id: 'task-4',
      title: 'Audit change detection & optimize OnPush',
      description: 'Ensure all presentational components leverage fine-grained signals to eliminate unnecessary zone digest cycles.',
      status: 'todo',
      priority: 'high',
      assignee: this.teamMembers[2],
      estimateHours: 8,
      tags: ['performance', 'signals'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
    },
    {
      id: 'task-5',
      title: 'Design Dark Mode Kanban board header & stats',
      description: 'Implement high-contrast stats bar showing completion rate, total velocity, and urgent item badges.',
      status: 'review',
      priority: 'low',
      assignee: this.teamMembers[3],
      estimateHours: 3,
      tags: ['design', 'tailwind'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12h ago
    },
  ]);

  // === 2. COMPUTED SIGNALS (Derived State) ===
  filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const p = this.priorityFilter();
    const a = this.assigneeFilter();

    return this.tasks().filter((task) => {
      const matchSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchPriority = p === 'all' || task.priority === p;
      const matchAssignee = a === 'all' || task.assignee.name === a;

      return matchSearch && matchPriority && matchAssignee;
    });
  });

  // Filtered by column status
  todoTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'todo'));
  inProgressTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'in_progress'));
  reviewTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'review'));
  doneTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'done'));

  // Metrics Dashboard Computeds
  totalCount = computed(() => this.tasks().length);
  doneCount = computed(() => this.tasks().filter((t) => t.status === 'done').length);
  urgentCount = computed(() => this.tasks().filter((t) => t.priority === 'urgent' && t.status !== 'done').length);
  totalEstimatedHours = computed(() => this.tasks().reduce((sum, t) => sum + (t.estimateHours || 0), 0));
  completionRate = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.doneCount() / total) * 100);
  });

  // === 3. EFFECTS (Persistence) ===
  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('angular_mastery_day2_tasks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Restore Dates properly
            this.tasks.set(
              parsed.map((t: any) => ({
                ...t,
                createdAt: new Date(t.createdAt),
              }))
            );
          }
        } catch {
          // ignore error
        }
      }

      effect(() => {
        localStorage.setItem('angular_mastery_day2_tasks', JSON.stringify(this.tasks()));
      });
    }
  }

  // === 4. ACTIONS & HANDLERS ===
  openCreateModal(defaultStatus: TaskStatus = 'todo'): void {
    this.editingTaskId.set(null);
    this.formTitle.set('');
    this.formDescription.set('');
    this.formStatus.set(defaultStatus);
    this.formPriority.set('medium');
    this.formAssigneeName.set(this.teamMembers[0].name);
    this.formEstimate.set(4);
    this.formTagsString.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task): void {
    this.editingTaskId.set(task.id);
    this.formTitle.set(task.title);
    this.formDescription.set(task.description);
    this.formStatus.set(task.status);
    this.formPriority.set(task.priority);
    this.formAssigneeName.set(task.assignee.name);
    this.formEstimate.set(task.estimateHours);
    this.formTagsString.set(task.tags.join(', '));
    this.isModalOpen.set(true);
  }

  saveTask(): void {
    const title = this.formTitle().trim();
    if (!title) return;

    const assignee =
      this.teamMembers.find((m) => m.name === this.formAssigneeName()) || this.teamMembers[0];
    const tags = this.formTagsString()
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const editId = this.editingTaskId();

    if (editId) {
      // Update existing
      this.tasks.update((prev) =>
        prev.map((t) =>
          t.id === editId
            ? {
                ...t,
                title,
                description: this.formDescription().trim(),
                status: this.formStatus(),
                priority: this.formPriority(),
                assignee,
                estimateHours: Number(this.formEstimate()) || 1,
                tags,
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description: this.formDescription().trim(),
        status: this.formStatus(),
        priority: this.formPriority(),
        assignee,
        estimateHours: Number(this.formEstimate()) || 1,
        tags,
        createdAt: new Date(),
      };
      this.tasks.update((prev) => [newTask, ...prev]);
    }

    this.isModalOpen.set(false);
  }

  handleStatusChange(event: { id: string; newStatus: TaskStatus }): void {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === event.id ? { ...t, status: event.newStatus } : t))
    );
  }

  handleDeleteTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  resetDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('angular_mastery_day2_tasks');
    }
    window.location.reload();
  }
}
