import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { Cart, CartItem } from 'src/app/shared/models/cart.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit, OnDestroy {
  subs$: Subscription;
  cartQuantity: number = 0;
  cartCount = 0;
  cartSubs$: Subscription;
  serversubs$: Subscription;
  authSubs$: Subject<any> = new Subject();

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
      this._getCart();
      this.cartService.getInitialCart();
  }

  private _getCart() {
    this.authService.isUserLoggedIn$.pipe(takeUntil(this.authSubs$)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.subs$ = this.cartService.cart$.subscribe((cart: Cart) => {
          this.cartCount = 0;
          if (cart) {
            cart.items.map((item: CartItem) => {
              this.cartCount += +item.quantity;
            });
            if(this.cartCount < 0) {
              this.cartCount = 0
            }
          }
        })
      }
      else {

        this.serversubs$ = this.cartService.serverCart$.pipe(take(1)).subscribe((cart: { totalPrice: number, quantity: number }) => {
          this.cartCount = cart.quantity;
          if(this.cartCount < 0) {
            this.cartCount = 0
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubs$.next(null);
    this.authSubs$.complete();
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
    if (this.serversubs$) {
      this.serversubs$.unsubscribe();
    }
  }

}
