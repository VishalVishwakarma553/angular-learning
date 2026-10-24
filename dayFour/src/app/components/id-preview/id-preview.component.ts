import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-id-preview',
  standalone: true,
  template: `
    <div class="relative w-full max-w-md bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xl shadow-stone-200/40 overflow-hidden group transition-all">
      
      <!-- Subtle warm ambient accents -->
      <div class="absolute -right-12 -top-12 w-44 h-44 bg-amber-200/30 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute -left-12 -bottom-12 w-44 h-44 bg-orange-100/40 rounded-full blur-2xl pointer-events-none"></div>

      <!-- Card Header -->
      <div class="relative z-10 flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-mono text-xs font-bold shadow-xs">
            ID
          </div>
          <span class="text-xs font-bold tracking-wider text-stone-500 uppercase">DevConnect Pass</span>
        </div>

        <!-- Live Validation Status Badge -->
        <div>
          @if (isPending()) {
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Checking...
            </span>
          } @else if (isValid()) {
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified Pass
            </span>
          } @else {
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
              <span class="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
              Draft / Incomplete
            </span>
          }
        </div>
      </div>

      <!-- Avatar & Identity Section -->
      <div class="relative z-10 flex items-start gap-4 mb-5">
        <!-- Dynamic Avatar with Initials -->
        <div class="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-stone-700 p-0.5 shadow-md shadow-amber-500/15 shrink-0">
          <div class="w-full h-full bg-[#fbf9f5] rounded-[14px] flex items-center justify-center text-lg font-black text-amber-900 font-sans">
            {{ initials() }}
          </div>
          @if (data().availableForHire) {
            <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-3 ring-white" title="Available for hire"></span>
          }
        </div>

        <!-- Name & Handle -->
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-stone-900 tracking-tight truncate">
            {{ data().fullName || 'Developer Name' }}
          </h3>
          <p class="text-xs font-mono text-amber-700 flex items-center gap-1 mt-0.5">
            <span>&#64;</span><span>{{ data().username || 'username' }}</span>
          </p>
          <p class="text-xs text-stone-500 mt-1 font-medium">
            {{ data().role || 'Software Engineer' }}
          </p>
        </div>
      </div>

      <!-- Bio / Summary -->
      <div class="relative z-10 p-3 rounded-xl bg-[#faf8f5] border border-stone-200/70 text-xs text-stone-700 mb-5 leading-relaxed italic">
        "{{ data().bio || 'No bio specified yet.' }}"
      </div>

      <!-- Stats Grid (Hourly Rate & Experience) -->
      <div class="relative z-10 grid grid-cols-2 gap-3 mb-5">
        <div class="p-3 rounded-xl bg-[#faf8f5] border border-stone-200/70">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">Rate / Hour</span>
          <span class="text-base font-bold text-stone-900 font-mono mt-0.5 block">
            &dollar;{{ data().hourlyRate || 0 }} <span class="text-[11px] font-normal text-stone-500">/hr</span>
          </span>
        </div>

        <div class="p-3 rounded-xl bg-[#faf8f5] border border-stone-200/70">
          <span class="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">Experience</span>
          <span class="text-base font-bold text-stone-900 font-mono mt-0.5 block">
            {{ data().experienceYears || 0 }} <span class="text-[11px] font-normal text-stone-500">years</span>
          </span>
        </div>
      </div>

      <!-- Dynamic Skills List (From FormArray) -->
      <div class="relative z-10 mb-4">
        <span class="text-[10px] text-stone-400 uppercase tracking-wider font-bold block mb-2">
          Verified Tech Stack ({{ skillsList().length }})
        </span>

        <div class="flex flex-wrap gap-1.5 min-h-[32px]">
          @for (s of skillsList(); track $index) {
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border"
              [class.bg-amber-100]="s.level === 'lead'"
              [class.text-amber-900]="s.level === 'lead'"
              [class.border-amber-300]="s.level === 'lead'"
              [class.bg-indigo-50]="s.level === 'senior'"
              [class.text-indigo-900]="s.level === 'senior'"
              [class.border-indigo-200]="s.level === 'senior'"
              [class.bg-emerald-50]="s.level === 'mid'"
              [class.text-emerald-900]="s.level === 'mid'"
              [class.border-emerald-200]="s.level === 'mid'"
              [class.bg-stone-100]="s.level === 'junior'"
              [class.text-stone-800]="s.level === 'junior'"
              [class.border-stone-200]="s.level === 'junior'"
            >
              <span>{{ s.name }}</span>
              <span class="text-[9px] uppercase font-mono opacity-60">({{ s.level }})</span>
            </span>
          } @empty {
            <span class="text-xs text-stone-400 italic">No skills added yet.</span>
          }
        </div>
      </div>

      <!-- Card Bottom Footer / Barcode decoration -->
      <div class="relative z-10 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <span>DevConnect #{{ barcodeHash() }}</span>
        <span class="text-emerald-700 font-semibold">AUTHENTIC PASS</span>
      </div>

    </div>
  `,
})
export class IdPreviewComponent {
  data = input.required<any>();
  isValid = input<boolean>(false);
  isPending = input<boolean>(false);

  initials = computed(() => {
    const name = (this.data().fullName || '').trim();
    if (!name) return 'DC';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  });

  skillsList = computed(() => {
    const raw = this.data().skills;
    if (!Array.isArray(raw)) return [];
    return raw.filter((s: any) => s && s.name && s.name.trim().length > 0);
  });

  barcodeHash = computed(() => {
    const user = this.data().username || 'dev';
    return Math.abs(
      user.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0) * 17, 1024)
    ).toString().padStart(6, '0');
  });
}
