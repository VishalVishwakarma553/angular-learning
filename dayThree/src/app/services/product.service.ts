import { computed, Injectable, signal } from '@angular/core';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // === 1. STATE (Signals) ===
  selectedCategory = signal<ProductCategory>('all');
  searchQuery = signal<string>('');
  sortBy = signal<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Static Inventory Catalog
  #products = signal<Product[]>([
    {
      id: 'prod-1',
      name: 'MacBook Pro 16" M3 Max',
      description: '16-core CPU, 40-core GPU, 48GB Unified Memory, Liquid Retina XDR display.',
      price: 3499,
      originalPrice: 3899,
      rating: 4.9,
      reviewsCount: 328,
      category: 'laptops',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 8,
      featured: true,
    },
    {
      id: 'prod-2',
      name: 'Sony WH-1000XM5 ANC Headphones',
      description: 'Industry-leading noise cancellation with two processors and 8 microphones.',
      price: 398,
      originalPrice: 448,
      rating: 4.8,
      reviewsCount: 1240,
      category: 'audio',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 15,
      featured: true,
    },
    {
      id: 'prod-3',
      name: 'Keychron Q1 Pro Wireless Mechanical',
      description: 'Custom CNC aluminum hot-swappable keyboard with QMK/VIA support and Gateron switches.',
      price: 199,
      rating: 4.7,
      reviewsCount: 512,
      category: 'peripherals',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 12,
    },
    {
      id: 'prod-4',
      name: 'Apple Watch Ultra 2 Titanium',
      description: 'Rugged 49mm titanium case, precision dual-frequency GPS, up to 36 hours battery.',
      price: 799,
      originalPrice: 849,
      rating: 4.9,
      reviewsCount: 410,
      category: 'wearables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 6,
      featured: true,
    },
    {
      id: 'prod-5',
      name: 'Dell XPS 15 OLED InfinityEdge',
      description: '13th Gen Intel Core i9, 32GB DDR5, RTX 4070, 3.5K OLED touchscreen display.',
      price: 2499,
      rating: 4.6,
      reviewsCount: 184,
      category: 'laptops',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 5,
    },
    {
      id: 'prod-6',
      name: 'Logitech MX Master 3S Wireless',
      description: 'Quiet clicks and 8K DPI tracking on any glass surface with MagSpeed electromagnetic wheel.',
      price: 99,
      rating: 4.9,
      reviewsCount: 2310,
      category: 'peripherals',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 24,
    },
    {
      id: 'prod-7',
      name: 'Shure SM7B Vocal Studio Microphone',
      description: 'Cardioid dynamic vocal microphone for studio recording, streaming, and podcasting.',
      price: 399,
      rating: 4.9,
      reviewsCount: 890,
      category: 'audio',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      inStock: false, // Demo out-of-stock toast warning
      stockCount: 0,
    },
    {
      id: 'prod-8',
      name: 'Garmin Fenix 7X Sapphire Solar',
      description: 'Multisport GPS smartwatch with solar charging lens, built-in flashlight, and Topo maps.',
      price: 899,
      originalPrice: 999,
      rating: 4.8,
      reviewsCount: 310,
      category: 'wearables',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
      inStock: true,
      stockCount: 4,
    },
  ]);

  // Readonly exposure
  readonly products = this.#products.asReadonly();

  // === 2. COMPUTED SIGNALS (Filtering & Sorting) ===
  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    const sort = this.sortBy();

    let result = this.#products().filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    // Apply sorting
    return result.sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  });

  readonly categories: { id: ProductCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Products', icon: 'grid' },
    { id: 'laptops', label: 'Laptops', icon: 'laptop' },
    { id: 'audio', label: 'Audio & Music', icon: 'headphones' },
    { id: 'peripherals', label: 'Peripherals', icon: 'mouse' },
    { id: 'wearables', label: 'Wearables', icon: 'watch' },
  ];
}
