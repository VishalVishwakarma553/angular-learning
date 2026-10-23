import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (cartService.isDrawerOpen()) {
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        (click)="cartService.closeDrawer()"
      ></div>

      <!-- Slide-over Drawer Panel -->
      <aside
        aria-label="Shopping Cart Drawer"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-left"
        (click)="$event.stopPropagation()"
      >
        <!-- Drawer Header -->
        <div class="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div class="flex items-center gap-2.5">
            <h2 class="text-base font-bold text-white">Your Shopping Bag</h2>
            <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              {{ cartService.itemCount() }}
            </span>
          </div>

          <button
            type="button"
            (click)="cartService.closeDrawer()"
            class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Drawer"
            aria-label="Close Drawer"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Drawer Body (Items List) -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          @for (item of cartService.items(); track item.product.id) {
            <div class="flex gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 group">
              <!-- Item Image -->
              <img
                [src]="item.product.image"
                [alt]="item.product.name"
                class="w-16 h-16 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
              />

              <!-- Item Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="text-xs font-bold text-slate-100 line-clamp-1">
                      {{ item.product.name }}
                    </h4>
                    <button
                      type="button"
                      (click)="cartService.removeFromCart(item.product.id)"
                      class="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p class="text-[11px] text-slate-400 font-mono mt-0.5">
                    &dollar;{{ item.product.price.toLocaleString() }} each
                  </p>
                </div>

                <!-- Quantity Selector -->
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                  <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg p-0.5">
                    <button
                      type="button"
                      (click)="cartService.updateQuantity(item.product.id, -1)"
                      class="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                      title="Decrease quantity"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span class="w-6 text-center text-xs font-mono font-bold text-slate-200">
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      (click)="cartService.updateQuantity(item.product.id, 1)"
                      [disabled]="item.quantity >= item.product.stockCount"
                      class="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      title="Increase quantity"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <!-- Subtotal for this item -->
                  <span class="text-xs font-mono font-bold text-slate-200">
                    &dollar;{{ (item.product.price * item.quantity).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          } @empty {
            <!-- Empty Cart State -->
            <div class="h-full flex flex-col items-center justify-center text-center p-8">
              <div class="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mb-4">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-300">Your bag is empty</h3>
              <p class="text-xs text-slate-500 mt-1 max-w-xs">
                Explore the catalog and add modern devices to test the global signal store.
              </p>
            </div>
          }
        </div>

        <!-- Drawer Footer (Summary & Checkout) -->
        @if (!cartService.isEmpty()) {
          <div class="p-6 border-t border-slate-800 bg-slate-950/60 space-y-4">
            
            <!-- Promo Code Input -->
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="Promo Code (try: ANGULAR19)"
                [value]="promoInput()"
                (input)="promoInput.set($any($event.target).value)"
                class="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
              <button
                type="button"
                (click)="applyPromo()"
                class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>

            <!-- Active Promo Pill -->
            @if (cartService.activePromo(); as promo) {
              <div class="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-300">
                <span class="flex items-center gap-1.5">
                  <span>✓</span>
                  <span><strong>{{ promo.code }}</strong> ({{ promo.discountPercent }}% off)</span>
                </span>
                <button
                  type="button"
                  (click)="cartService.removePromo()"
                  class="text-emerald-400 hover:text-emerald-200 underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            }

            <!-- Price Breakdown Computeds -->
            <div class="space-y-1.5 text-xs text-slate-400">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-mono text-slate-200">&dollar;{{ cartService.subtotal().toLocaleString() }}</span>
              </div>

              @if (cartService.discountAmount() > 0) {
                <div class="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span class="font-mono">-&dollar;{{ cartService.discountAmount().toLocaleString() }}</span>
                </div>
              }

              <div class="flex justify-between">
                <span>Est. Tax (8%)</span>
                <span class="font-mono text-slate-200">&dollar;{{ cartService.taxAmount().toLocaleString() }}</span>
              </div>

              <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total</span>
                <span class="font-mono text-indigo-400 text-base">
                  &dollar;{{ cartService.finalTotal().toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Checkout CTA -->
            <button
              type="button"
              (click)="cartService.checkout()"
              class="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Complete Order</span>
              <span>→</span>
            </button>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    @keyframes slideLeft {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .animate-slide-left {
      animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `],
})
export class CartDrawerComponent {
  // Direct Dependency Injection of CartService
  readonly cartService = inject(CartService);

  // Local component signal for promo code form
  promoInput = signal('');

  applyPromo(): void {
    if (!this.promoInput().trim()) return;
    const success = this.cartService.applyPromo(this.promoInput());
    if (success) {
      this.promoInput.set('');
    }
  }
}
