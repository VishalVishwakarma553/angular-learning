import { Component, inject, input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div
      class="group relative bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur-sm overflow-hidden"
    >
      <!-- Top Section: Image & Badges -->
      <div class="relative w-full aspect-video rounded-xl bg-slate-950 overflow-hidden mb-4 border border-slate-800/60">
        <img
          [src]="product().image"
          [alt]="product().name"
          loading="lazy"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Category Pill Top-Left -->
        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60">
            {{ product().category }}
          </span>

          @if (product().featured) {
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-950/90 backdrop-blur-md text-indigo-300 border border-indigo-700/60">
              Featured
            </span>
          }
        </div>

        <!-- Stock Status Pill Top-Right -->
        <div class="absolute top-2.5 right-2.5">
          @if (!product().inStock) {
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-950/90 backdrop-blur-md text-rose-300 border border-rose-800/60">
              Sold Out
            </span>
          } @else if (product().stockCount <= 5) {
            <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-950/90 backdrop-blur-md text-amber-300 border border-amber-800/60 animate-pulse">
              Only {{ product().stockCount }} Left
            </span>
          }
        </div>
      </div>

      <!-- Mid Section: Title & Details -->
      <div class="flex-1 flex flex-col justify-between mb-4">
        <div>
          <!-- Rating & Reviews -->
          <div class="flex items-center gap-1.5 mb-1.5 text-xs text-amber-400">
            <span class="font-bold flex items-center gap-1">
              ★ {{ product().rating }}
            </span>
            <span class="text-slate-500">•</span>
            <span class="text-slate-500 font-mono">({{ product().reviewsCount }} reviews)</span>
          </div>

          <!-- Product Title -->
          <h3 class="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {{ product().name }}
          </h3>

          <!-- Product Description -->
          <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {{ product().description }}
          </p>
        </div>

        <!-- Price Section -->
        <div class="mt-4 flex items-baseline gap-2">
          <span class="text-lg font-black text-white font-mono">
            &dollar;{{ product().price.toLocaleString() }}
          </span>
          @if (product().originalPrice; as orig) {
            <span class="text-xs text-slate-500 line-through font-mono">
              &dollar;{{ orig.toLocaleString() }}
            </span>
            <span class="text-[11px] font-semibold text-emerald-400">
              Save &dollar;{{ (orig - product().price).toLocaleString() }}
            </span>
          }
        </div>
      </div>

      <!-- Bottom Action: Direct Cart Injection without prop-drilling -->
      <button
        type="button"
        (click)="cartService.addToCart(product())"
        [disabled]="!product().inStock"
        class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        [class.bg-indigo-600]="product().inStock"
        [class.hover:bg-indigo-500]="product().inStock"
        [class.text-white]="product().inStock"
        [class.shadow-lg]="product().inStock"
        [class.shadow-indigo-600/20]="product().inStock"
        [class.bg-slate-800]="!product().inStock"
        [class.text-slate-500]="!product().inStock"
        [class.cursor-not-allowed]="!product().inStock"
      >
        @if (product().inStock) {
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add to Bag</span>
        } @else {
          <span>Out of Stock</span>
        }
      </button>
    </div>
  `,
})
export class ProductCardComponent {
  // Signal Input (Day 2 concept)
  product = input.required<Product>();

  // Injected Cart Service (Day 3 concept: direct state mutation without events!)
  readonly cartService = inject(CartService);
}
