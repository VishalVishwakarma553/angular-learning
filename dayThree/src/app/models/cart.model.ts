import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}