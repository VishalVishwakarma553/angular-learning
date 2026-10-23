export type ProductCategory = 'all' | 'laptops' | 'audio' | 'peripherals' | 'wearables';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: 'laptops' | 'audio' | 'peripherals' | 'wearables';
  image: string;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
}