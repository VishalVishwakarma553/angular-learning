import { Component, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

export interface Task {
  id: string;
  title: string;
  category: 'Work' | 'Health' | 'Study' | 'Personal';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = signal('dayOne');

  // === 1. SIGNALS (React's useState) ===
  newTitle = signal('');
  selectedCategory = signal<'Work' | 'Health' | 'Study' | 'Personal'>('Work');
  selectedPriority = signal<'low' | 'medium' | 'high'>('medium');
  filterStatus = signal<FilterStatus>('all');
  filterCategory = signal<string>('All');
  searchQuery = signal<string>('');

  tasks = signal<Task[]>([
    {
      id: '1',
      title: 'Master modern Angular Signals vs React Hooks',
      category: 'Study',
      priority: 'high',
      completed: true,
      createdAt: 'Today, 9:00 AM'
    },
    {
      id: '2',
      title: 'Build the PulseTask habit tracker UI with Tailwind',
      category: 'Work',
      priority: 'high',
      completed: false,
      createdAt: 'Today, 10:30 AM'
    },
    {
      id: '3',
      title: 'Drink 2.5L water & take a 15-min walk',
      category: 'Health',
      priority: 'medium',
      completed: false,
      createdAt: 'Today, 12:00 PM'
    },
    {
      id: '4',
      title: 'Explore Angular control flow: @if and @for syntax',
      category: 'Study',
      priority: 'low',
      completed: false,
      createdAt: 'Today, 2:15 PM'
    }
  ]);

  categories: ('Work' | 'Health' | 'Study' | 'Personal')[] = ['Work', 'Health', 'Study', 'Personal'];

  // === 2. COMPUTED SIGNALS (React's useMemo) ===
  totalCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.tasks().filter(t => t.completed).length);
  activeCount = computed(() => this.tasks().filter(t => !t.completed).length);
  completionRate = computed(() => {
    const total = this.totalCount();
    return total === 0 ? 0 : Math.round((this.completedCount() / total) * 100);
  });

  filteredTasks = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();
    const category = this.filterCategory();

    return this.tasks().filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(q);
      const matchesStatus =
        status === 'all' ? true :
        status === 'active' ? !task.completed :
        task.completed;
      const matchesCategory = category === 'All' ? true : task.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  // === 3. EFFECTS & LIFECYCLE (React's useEffect) ===
  constructor() {
    // Safe check for browser environment (SSR compatible)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('pulse_tasks');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.tasks.set(parsed);
          } 
        } catch {
          // ignore corrupted data
        }
      }

      // Automatically syncs to localStorage whenever this.tasks() changes
      effect(() => {
        const currentTasks = this.tasks();
        localStorage.setItem('pulse_tasks', JSON.stringify(currentTasks));
      });
    }
  }

  // === 4. ACTIONS / EVENT HANDLERS ===
  addTask() {
    const trimmed = this.newTitle().trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmed,
      category: this.selectedCategory(),
      priority: this.selectedPriority(),
      completed: false,
      createdAt: 'Just now'
    };

    // Update signal state (like setTasks(prev => [newTask, ...prev]))
    this.tasks.update(prev => [newTask, ...prev]);

    // Reset input
    this.newTitle.set('');
  }

  toggleTask(id: string) {
    this.tasks.update(tasks =>
      tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  deleteTask(id: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  clearCompleted() {
    this.tasks.update(tasks => tasks.filter(t => !t.completed));
  }

  resetDemo() {
    localStorage.removeItem('pulse_tasks');
    this.tasks.set([
      {
        id: '1',
        title: 'Master modern Angular Signals vs React Hooks',
        category: 'Study',
        priority: 'high',
        completed: true,
        createdAt: 'Today, 9:00 AM'
      },
      {
        id: '2',
        title: 'Build the PulseTask habit tracker UI with Tailwind',
        category: 'Work',
        priority: 'high',
        completed: false,
        createdAt: 'Today, 10:30 AM'
      },
      {
        id: '3',
        title: 'Drink 2.5L water & take a 15-min walk',
        category: 'Health',
        priority: 'medium',
        completed: false,
        createdAt: 'Today, 12:00 PM'
      },
      {
        id: '4',
        title: 'Explore Angular control flow: @if and @for syntax',
        category: 'Study',
        priority: 'low',
        completed: false,
        createdAt: 'Today, 2:15 PM'
      }
    ]);
  }
}
