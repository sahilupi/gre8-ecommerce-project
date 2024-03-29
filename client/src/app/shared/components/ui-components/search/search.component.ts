import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';

import { Product } from 'src/app/shared/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('in', style({
        opacity: 1,
      })),
      transition('void => *', [
        animate(300, keyframes([
          style({
            opacity: 0
          }),
          style({
            opacity: 0.5
          }),
          style({
            opacity: 1
          }),
          style({
            opacity: 1
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(50, style({
            color: 'red'
          })),
          animate(250, style({
            opacity: 0
          }))
        ])
      ])
    ]),
    trigger('list2', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            transform: 'translateY(-100px)',
            opacity: 0,
            offset: 0
          }),
          style({
            transform: 'translateY(-50px)',
            opacity: 0.5,
            offset: 0
          }),
          style({
            transform: 'translateY(-20px)',
            opacity: 1,
            offset: 0.1
          }),
          style({
            transform: 'translateY(0px)',
            opacity: 1,
            offset: 0.4
          })
        ]))
      ]),
      transition('* => void', [
        group([
          animate(50, style({
            color: 'red'
          })),
          animate(250, style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
})
export class SearchComponent implements OnInit {
  products: Product[] = [];
  isLoadingProducts = false;
  serverErrMsg: string;
  isNotFound = false;

  searchField: FormControl;
  coolForm: FormGroup;
  products$: Observable<Product[]>;


  constructor(private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchField = new FormControl();
    this.coolForm = this.fb.group({ search: this.searchField });
    this.searchField.valueChanges.pipe(
      debounceTime(400),
      switchMap(searchText => {
        if (searchText.trim() !== "") {
          this.isLoadingProducts = true;
          return this.productService.getProducts(undefined, undefined, searchText.trim())
        }
        this.products = [];
        this.isNotFound = true;
        return EMPTY;
      })
    ).subscribe(res => {
      if (!res['products']) {
        this.products = [];
        this.isNotFound = true;
      }
      else {
        this.products = res['products'];
        this.isNotFound = false;
      }
      this.isLoadingProducts = false;
      this.serverErrMsg = '';
    }, err => {
      this.isLoadingProducts = false;
      this._errorHandler(err);
    });
  }

  closeSearchBar() {
    document.body.classList.remove('predictive__search--box_active');
    document.getElementById('search')?.classList.remove('active');
  }

  onClearProducts(clearSearchEvent?: boolean) {
    if (clearSearchEvent) {
      this.products = [];
      return;
    }
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
}
