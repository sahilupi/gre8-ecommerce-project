import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from 'src/app/shared/models/product.model';
import { ProductsResponse } from 'src/app/shared/models/responses.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent  implements OnInit {

  customOptionsFeatures: OwlOptions = {
    nav: true,
    dots: true,
    loop: false,
    margin: 20,
    responsive: {
      0: {
        "items": 1
      },
      480: {
        "items": 1
      },
      768: {
        "items": 3
      },
      992: {
        "items": 4
      },
      1200: {
        "items": 4,
        "nav": true
      }
    }
  }
  products: Product[];
  isLoading = false;
  isError = false;
  isLoadingDelete = false;
  serverErrMsg: string = '';
  constructor( private productService: ProductService ) {}

  ngOnInit() {
    this._getFeaturedProducts();
    // this.products = this.productService.products.slice(0, 1);
  }

  _getFeaturedProducts() {
    this.isLoading = true;
    // getFeaturedProducts(4, -1) // first argument (i.e 4) refers to product count and second argument refers to sorting(-1 means descending bu date and 1 means ascending by date)
    this.productService.getFeaturedProducts(10, -1).subscribe((res: ProductsResponse) => {
      this.products = res['products'];
      this.isLoading = false;
      this.isError = false;
    }, err => {
      this.isLoading = false;
      this.isError = true;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }
}
