import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { OwlOptions } from 'ngx-owl-carousel-o/public_api';
import { Category } from 'src/app/shared/models/category.model';
import { Product } from 'src/app/shared/models/product.model';
import { ProductsResponse } from 'src/app/shared/models/responses.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  customOptionshome: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 0,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplaySpeed: 1500,
    autoplayHoverPause: true,
    navSpeed: 5000,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
        "items": 1
      },
      480: {
        "items": 1
      },
      768: {
        "items": 1
      },
      992: {
        "items": 1
      },
      1200: {
        "items": 1,
      }
    }
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 0,
    navSpeed: 400,
    autoplay: false,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
        "items": 2,
      },
      480: {
        "items": 3
      },
      600: {
        "items": 4
      },
      768: {
        "items": 4
      },
      992: {
        "items": 5
      },
      1200: {
        "items": 5,
      }
    }
  }

  customOptionsCategorySmall: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 0,
    navSpeed: 400,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplaySpeed: 500,
    navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
    responsive: {
      0: {
        "items": 6,
      },
      480: {
        "items": 6
      },
      600: {
        "items": 7
      },
      768: {
        "items": 8
      },
      992: {
        "items": 5
      },
      1200: {
        "items": 5,
      }
    }
  }

  products: Product[] = [];
  categories: Category[] = [];
  categoriesSmall: Category[] = [];
  isLoadingProducts = false;
  isLoadingCategories = false;
  isCategoryPage = false;
  serverErrMsg: string;


  constructor( private productService: ProductService, private categoryService: CategoryService ) {}

  ngOnInit(): void {
    // document.getElementById('vid').play();
    this.categories = this.categoryService.categories;
    this.categoriesSmall = this.categoryService.categoriesSmall;
    this._getProducts();
    this.scrollTop();
  }

  private _getProducts() {
    this.isLoadingProducts = true;
    this.productService.getProducts(undefined, undefined, undefined, undefined, true).subscribe((res: ProductsResponse) => {
      if (!res['products']) {
        this.products = [];
      }
      else {
        this.products = res['products'];
      }
      this.isLoadingProducts = false;
      this.isLoadingCategories = false;
      this.serverErrMsg = '';
    }, err => {
      this.isLoadingProducts = false;
      this.isLoadingCategories = false;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      if (err.error['message'] === 'No Products found' && err.status === 404) {
        this.products = [];
      }
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

  private scrollTop() {
    window.scrollTo({
      top: 0
    })
  }
}
