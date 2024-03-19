import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Product } from 'src/app/shared/models/product.model';
import { ProductsResponse } from 'src/app/shared/models/responses.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  products: Product[] = [];
  isFilterBarOpen = false;
  isLoadingProducts = false;
  isLoadingCategories = false;
  isCategoryPage = false;
  serverErrMsg: string;
  collectionName: string;
  sizes: any[] = [];

  constructor( private productService: ProductService, private router: Router, private activatedRoute: ActivatedRoute, private title: Title ) {}

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.scrollTop();
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['name']) {
        const updatedName = params['name'].split('-').join(' ');
        this.collectionName = updatedName;
        this.title.setTitle(updatedName.charAt(0).toUpperCase() + updatedName.slice(1) + ' collection - Gre8');
        this._getProducts(updatedName);
      }
    })
  }

  private _getProducts(filters?: any) {
    this.isLoadingProducts = true;
    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      if (queryParams) {
        filters = Object.assign({}, { categories: filters, sizes: queryParams['sizes'], weight: queryParams['weight'], price: queryParams['price'] })
        // getting products with filters
        this.productService.getProducts(filters).subscribe((res: ProductsResponse) => {
          // marking filter value as checked when after refreshing or loading page
          this.sizes.map(size => {
            size.checked = (queryParams['sizes']?.split(':').includes(size.value));
          })
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
      else {
        // getting products without filters
        this.productService.getProducts(filters).subscribe((res: ProductsResponse) => {
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
