import { Product } from "./product.model";

export class Wishlist {
  constructor( public items: WishlistItem[] ) {}
}

export class WishlistItem {
  constructor( public productId: string, public quantity: number, public _id?: string, public size?: string ) {}
}

export class WishlistProduct {
  constructor( public product: Product, public quantity: number, public size?: string, public color?: string, public productId?: string, public _id?: string ) {}
}
