import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CartService, PostCartResponse } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-product',
  styles: [
    `.discount_badge {
      color: red;
      margin-left: 4px;
      font-weight: 700;
    }
    `
  ],
  templateUrl: './product.component.html',
})
export class ProductComponent {

  @Input() product: Product;
  ratings: number = 5;
  isSnackbarShown = false;
  isLoading = false;
  serverErrMsg: string;
  @Input() isToAddSnackbar = true;

  constructor(private cartService: CartService, private authService: AuthService) { }

  numSequence(num: number): Array<number> {
    return Array(num);
  }

  onAddtoCart(productId: string) {
    const cartItem = {
      productId: productId,
      quantity: 1
    }
    // if user in not logged in
    if (!this.authService.isUserLoggedIn()) {
      this.cartService.setCartToLocalStorage(cartItem);
      this.isSnackbarShown = true;
    }
    else {
      // if user is logged in
      this.isLoading = true;
      this.cartService.postCart(cartItem, true).subscribe((res: PostCartResponse) => {
        this.isLoading = false;
        this.isSnackbarShown = true;
        this.cartService.serverCart$.next({ totalPrice: +res.totalPrice, quantity: +res.quantity })
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoading = false;
        this._errorHandler(err);
      })
    }
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message']
    } else {
      this.serverErrMsg = 'An error occured'
    }
  }
}
