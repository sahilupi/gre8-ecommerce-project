export class Category {
  constructor(
    public _id: string,
    public name: string,
    public icon: string,
    public imgSrc: string,
    public checked: boolean,
    public categorySmallName?: string
    ) {}
}
