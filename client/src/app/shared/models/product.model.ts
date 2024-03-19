import { Category } from "./category.model";

export class Product {
  constructor(
    public _id: string,
    public name: string,
    public label: string,
    public richDescription: string,
    public description: string,
    public image: string,
    public style: string,
    public images: [{color: string, imageUrls: string[]}],
    public categories: string[],
    public colors: [{name: string, code: string}],
    public weight: string,
    public sizes: string[],
    public washIntructions: string[],
    public features: string[],
    public brand: string,
    public mrpPrice: string | number,
    public currentPrice: string | number,
    public currency: string,
    public countInStock: number | string,
    public rating: number,
    public numReviews: number,
    public isFeatured: boolean,
    public category: Category,
    public reviews: Array<any>,
    public quantity: number,
    public author?: string,
    public id?: string
  ) { }
}
