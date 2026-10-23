import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <header class="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        <!-- Brand & Day 3 Badge -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-indigo-400 text-lg">
              D3
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-base font-bold tracking-tight text-white">NexStore</span>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                Signals Store
              </span>
            </div>
            <p class="text-xs text-slate-400">Services, DI & State Management</p>
          </div>
        </div>

        <!-- Search Bar Bound Directly to ProductService Signal -->
        <div class="relative flex-1 max-w-md hidden sm:block">
          <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search high-end tech gear..."
            [value]="productService.searchQuery()"
            (input)="productService.searchQuery.set($any($event.target).value)"
            class="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <!-- Right Side: Promo notification & Cart Trigger -->
        <div class="flex items-center gap-3">
          <!-- Discount Hint Pill -->
          <div class="hidden md:flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-800/50 px-2.5 py-1 rounded-full">
            <span>🏷️ Code:</span>
            <code class="font-mono font-bold">ANGULAR19</code>
            <span>(15% OFF)</span>
          </div>

          <!-- Cart Trigger Button with Live Counter Badge -->
          <button
            type="button"
            (click)="cartService.toggleDrawer()"
            class="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-all cursor-pointer hover:bg-slate-800/80 group"
            title="Open Bag"
          >
            <!-- Cart Icon -->
            <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>

            <!-- Total Price Preview -->
            <span class="text-xs font-semibold font-mono hidden sm:inline">
              &dollar;{{ cartService.subtotal().toLocaleString() }}
            </span>

            <!-- Quantity Badge (Reactive to cartService.itemCount signal) -->
            <span
              class="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full text-xs font-bold font-mono transition-transform group-hover:scale-110"
              [class.bg-indigo-600]="cartService.itemCount() > 0"
              [class.text-white]="cartService.itemCount() > 0"
              [class.bg-slate-800]="cartService.itemCount() === 0"
              [class.text-slate-400]="cartService.itemCount() === 0"
            >
              {{ cartService.itemCount() }}
            </span>
          </button>
        </div>

      </div>
    </header>
  `,
})
export class NavbarComponent {
  // Clean Dependency Injections
  readonly cartService = inject(CartService);
  readonly productService = inject(ProductService);
}
