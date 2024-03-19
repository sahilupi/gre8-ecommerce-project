import { Product } from "./product.model";

export class Cart {
  constructor( public items: CartItem[] ) {}
}

export class CartItem {
  constructor( public productId: string, public quantity: number, public _id?: string, public size?: string ) {}
}

export class CartProduct {
  constructor( public product: Product, public quantity: number, public size?: string, public color?: string, public productId?: string, public _id?: string ) {}
}
