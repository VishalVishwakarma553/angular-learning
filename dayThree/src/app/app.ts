import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { ToastService } from './services/toast.service';
import { ProductCategory } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ProductCardComponent,
    CartDrawerComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Modern Dependency Injections via inject()
  readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);
  readonly toastService = inject(ToastService);

  selectCategory(category: ProductCategory): void {
    this.productService.selectedCategory.set(category);
  }

  setSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.productService.sortBy.set(target.value as any);
  }

  // Demonstration method to test toast service dispatch
  testToastNotification(type: 'success' | 'warning' | 'error' | 'info'): void {
    switch (type) {
      case 'success':
        this.toastService.success('Sync Complete', 'Inventory levels verified with cloud backend.');
        break;
      case 'warning':
        this.toastService.warning('Flash Sale Ending', 'Promo code SIGNALS25 expires in 2 hours!');
        break;
      case 'error':
        this.toastService.error('Connection Dropped', 'Simulated network failure toast.');
        break;
      case 'info':
        this.toastService.info('Day 3 Mastery', 'Service-with-a-Signal architecture active.');
        break;
    }
  }
}
