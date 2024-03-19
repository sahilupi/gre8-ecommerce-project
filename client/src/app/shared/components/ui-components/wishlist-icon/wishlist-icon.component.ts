import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, take, takeUntil } from 'rxjs';
import { Wishlist, WishlistItem } from 'src/app/shared/models/wishlist.model';

import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist-icon',
  templateUrl: './wishlist-icon.component.html',
  styleUrls: ['./wishlist-icon.component.scss']
})
export class WishlistIconComponent implements OnInit, OnDestroy {
  subs$: Subscription;
  wishlistQuantity: number = 0;
  wishlistCount = 0;
  wishlistSubs$: Subscription;
  serversubs$: Subscription;
  authSubs$: Subject<any> = new Subject();

  constructor(private wishlistService: WishlistService, private authService: AuthService) { }

  ngOnInit(): void {
      this._getWishlist();
      this.wishlistService.getInitialWishlist();
  }

  private _getWishlist() {
    this.authService.isUserLoggedIn$.pipe(takeUntil(this.authSubs$)).subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.subs$ = this.wishlistService.wishlist$.subscribe((wishlist: Wishlist) => {
          this.wishlistCount = 0;
          if (wishlist) {
            wishlist.items.map((item: WishlistItem) => {
              this.wishlistCount += +item.quantity;
            });
            if(this.wishlistCount < 0) {
              this.wishlistCount = 0
            }
          }
        })
      }
      else {

        this.serversubs$ = this.wishlistService.serverWishlist$.pipe(take(1)).subscribe((wishlist: { totalPrice: number, quantity: number }) => {
          this.wishlistCount = wishlist.quantity;
          if(this.wishlistCount < 0) {
            this.wishlistCount = 0
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
