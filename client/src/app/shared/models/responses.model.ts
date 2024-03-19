import { Category } from "./category.model";
import { Product } from "./product.model";
import { User } from "./user.model";

export interface ServerResponse {
  success: boolean,
  message: string
}

export interface UserUpdateResponse {
  success: boolean,
  message: string,
  user: User
}

// product
export interface ProductsResponse {
  success: boolean;
  message: string;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

// category
export interface CategoriesResponse {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}
