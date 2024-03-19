import { Product } from "./product.model";

export class OrderItem {
  constructor(
    public quantity: number,
    public productId: Product,
    public product: Product,
    public _id?: string,
    public size?: string
  ) {}
}
