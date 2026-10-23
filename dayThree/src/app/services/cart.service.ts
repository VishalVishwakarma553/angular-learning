import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CartItem, PromoCode } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root', // Singleton store available throughout the app
})
export class CartService {
  // Service-to-Service Dependency Injection using modern inject()
  private toastService = inject(ToastService);

  // Available Promo Codes
  private availablePromos: PromoCode[] = [
    { code: 'ANGULAR19', discountPercent: 15, description: '15% off Angular Learning Discount' },
    { code: 'SIGNALS25', discountPercent: 25, description: '25% off Modern Signals Launch' },
    { code: 'DEV10', discountPercent: 10, description: '10% off Developer Special' },
  ];

  // === 1. PRIVATE WRITABLE SIGNALS (State Encapsulation) ===
  #items = signal<CartItem[]>([]);
  #activePromo = signal<PromoCode | null>(null);
  #isDrawerOpen = signal<boolean>(false);

  // === 2. PUBLIC READONLY SIGNALS (Safe Exposure) ===
  readonly items = this.#items.asReadonly();
  readonly activePromo = this.#activePromo.asReadonly();
  readonly isDrawerOpen = this.#isDrawerOpen.asReadonly();

  // === 3. COMPUTED SIGNALS (High-Performance Derived State) ===
  readonly itemCount = computed(() =>
    this.#items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.#items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly discountAmount = computed(() => {
    const promo = this.#activePromo();
    if (!promo) return 0;
    return Math.round((this.subtotal() * promo.discountPercent) / 100);
  });

  readonly taxAmount = computed(() => {
    const taxable = Math.max(0, this.subtotal() - this.discountAmount());
    return Math.round(taxable * 0.08); // 8% estimated tax
  });

  readonly finalTotal = computed(() => {
    return Math.max(0, this.subtotal() - this.discountAmount() + this.taxAmount());
  });

  readonly isEmpty = computed(() => this.#items().length === 0);

  // === 4. CONSTRUCTOR & LOCALSTORAGE PERSISTENCE ===
  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexstore_cart_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.#items.set(parsed);
          }
        } catch {
          // ignore cache error
        }
      }

      // Automatically sync to localStorage whenever #items() signal changes
      effect(() => {
        localStorage.setItem('nexstore_cart_v1', JSON.stringify(this.#items()));
      });
    }
  }

  // === 5. MUTATION METHODS (The ONLY way to update state) ===
  addToCart(product: Product, quantity = 1): void {
    if (!product.inStock) {
      this.toastService.warning('Out of Stock', `${product.name} is currently unavailable.`);
      return;
    }

    let addedNew = false;
    this.#items.update((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        // Enforce stock ceiling
        const newQty = Math.min(existing.quantity + quantity, product.stockCount);
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        addedNew = true;
        return [...current, { product, quantity: Math.min(quantity, product.stockCount) }];
      }
    });

    if (addedNew) {
      this.toastService.success('Added to Cart', `${product.name} is now in your bag.`);
    } else {
      this.toastService.info('Cart Updated', `Increased quantity of ${product.name}.`);
    }
  }

  updateQuantity(productId: string, delta: number): void {
    this.#items.update((current) => {
      return current
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            // Cap at product stock
            const capped = Math.min(nextQty, item.product.stockCount);
            return { ...item, quantity: capped };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  }

  removeFromCart(productId: string): void {
    const itemToRemove = this.#items().find((item) => item.product.id === productId);
    this.#items.update((current) => current.filter((item) => item.product.id !== productId));

    if (itemToRemove) {
      this.toastService.info('Item Removed', `${itemToRemove.product.name} was removed.`);
    }
  }

  applyPromo(codeString: string): boolean {
    const cleanCode = codeString.trim().toUpperCase();
    const found = this.availablePromos.find((p) => p.code === cleanCode);

    if (found) {
      this.#activePromo.set(found);
      this.toastService.success('Promo Applied!', `${found.description}`);
      return true;
    } else {
      this.toastService.error('Invalid Code', `Code "${cleanCode}" is expired or not valid.`);
      return false;
    }
  }

  removePromo(): void {
    this.#activePromo.set(null);
    this.toastService.info('Promo Removed');
  }

  toggleDrawer(force?: boolean): void {
    this.#isDrawerOpen.update((current) => (force !== undefined ? force : !current));
  }

  openDrawer(): void {
    this.#isDrawerOpen.set(true);
  }

  closeDrawer(): void {
    this.#isDrawerOpen.set(false);
  }

  checkout(): void {
    if (this.isEmpty()) return;

    this.toastService.success(
      'Order Confirmed! 🎉',
      `Charged $${this.finalTotal().toLocaleString()}. Thanks for shopping with NexStore!`
    );
    this.#items.set([]);
    this.#activePromo.set(null);
    this.#isDrawerOpen.set(false);
  }

  clearCart(): void {
    this.#items.set([]);
    this.toastService.info('Cart Cleared', 'All items were removed.');
  }
}
