import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';

import { Product } from 'src/app/shared/models/product.model';
import { WishlistProduct } from 'src/app/shared/models/wishlist.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CartService, PostCartResponse } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { PostWishlistResponse, WISHLIST_KEY, WishlistService } from 'src/app/shared/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent  implements OnInit {

  products: Product[];
  wishlistItems: WishlistProduct[] = [];
  serverErrMsg: string;
  isLoadingWishlist = false;
  isLoading = false;
  isLoadingDelete = false;
  isLoadingUpdateQuantity = false;
  isSnackbarShown = false;
  isLoadingCart = false;
  totalPrice: number = 0;
  quantity: number = 0;
  bagType: string = 'cart';

  constructor(private productService: ProductService, private wishlistService: WishlistService, private authService: AuthService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.isLoadingWishlist = true;
    if (!this.authService.isUserLoggedIn()) {
      this._getLocalStorageWishlist();
    }
    else {
      this._getWishlistFromServer();
    }
    this.scrollTop();
  }

  private _getLocalStorageWishlist() {
    this.wishlistService.wishlist$.pipe(take(1)).subscribe(respWishlist => {
      if (respWishlist && respWishlist.items.length > 0) {
        respWishlist.items.forEach(wishlistItem => {
          this.productService.getProduct(wishlistItem.productId).subscribe(res => {
            this.wishlistItems.push({
              product: res['product'],
              quantity: wishlistItem['quantity'],
              size: wishlistItem['size']
            });
            this.isLoadingWishlist = false;
          }, err => {
            this._errorHandler(err);
            this.isLoadingWishlist = false;
          });
        })
      }
      else {
        this.isLoadingWishlist = false;
      }
    });
  }

  private scrollTop() {
    window.scrollTo({
      top: 0
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'An error occured. Please try again!';
    }
  }

  onUpdateQuantity(value: number, product: Product) {
    if (!this.authService.isUserLoggedIn()) {
      product.quantity = value;
      this.wishlistService.setWishlistToLocalStorage({
        quantity: +value,
        productId: product._id
      }, true);

      const filteredProduct = this.wishlistItems.filter(prod => prod.product._id === product._id);
      filteredProduct[0]['quantity'] = +value;
    }
    else {
      const wishlistItem = {
        productId: product._id,
        quantity: +value
      }
      this.isLoadingUpdateQuantity = true;
      this.wishlistService.postWishlist(wishlistItem).subscribe((res: PostWishlistResponse) => {
        this.wishlistService.serverWishlist$.next({ totalPrice: +res.totalPrice, quantity: +res.quantity });
        this.totalPrice = +res.totalPrice;
        this.quantity = +res.quantity;
        const filteredProduct = this.wishlistItems.filter(prod => prod.product._id === product._id);
        filteredProduct[0]['quantity'] = +value;
        this.subTotal();
        this.isLoadingUpdateQuantity = false;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Wishlist Updated' });
      }, err => {
        this.isLoadingUpdateQuantity = false;
        this._errorHandler(err);
      })
    }
  }

  onDeleteItemFromWishlist(productId: string, index: number, price: number, quantity: number) {
    this.isLoadingDelete = true;
    if (!this.authService.isUserLoggedIn()) {
      this.wishlistService.deleteItemFromWishlist(productId);
      this.wishlistItems.splice(index, 1);
      this.isLoadingDelete = false;
    }
    else {
      this.wishlistService.postDeleteProductWishlist(productId).subscribe(res => {
        this.isLoadingDelete = false;
        this.totalPrice = (this.totalPrice - (+price * +quantity));
        this.quantity = (this.quantity - quantity);
        this.wishlistService.serverWishlist$.next({ totalPrice: this.totalPrice, quantity: this.quantity });
        this.wishlistItems.splice(index, 1);
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoadingDelete = false;
        this._errorHandler(err);
      });
    }
  }

  subTotal() {
    return Number(this.wishlistItems.reduce((acc, item) => {
      return acc + (+item.product.currentPrice * (item.product.quantity ? +item.product.quantity : +item.quantity));
    }, 0));
  }

  grandTotal() {
    if (this.subTotal() < 600) {
      return this.subTotal() + 120;
    }
    else {
      return this.subTotal();
    }
  }

  private _getWishlistFromServer() {
    setTimeout(() => {
      const fetchedWishlist = localStorage.getItem(WISHLIST_KEY);
      // if wishlist is present in localstorage, store that in user account and clear localstorage wishlist
      if (fetchedWishlist && JSON.parse(fetchedWishlist).items && JSON.parse(fetchedWishlist).items.length > 0) {
        const wishlist = JSON.parse(fetchedWishlist);
        this.wishlistService.postMultipleWishlist(wishlist).subscribe(() => {
          this.wishlistService.emptyWishlist();
          this.wishlistService.getWishlistFromServer().subscribe(res => {

            res.products.forEach((product: any) => {
              this.totalPrice += +product.productId.currentPrice * +product.quantity;
              this.quantity += +product.quantity;
              this.wishlistItems.push({
                product: product.productId,
                quantity: product.quantity,
                size: product.size
              });
              this.wishlistService.serverWishlist$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
            })
            this.isLoading = false;
            this.isLoadingWishlist = false;
          }, err => {
            this.isLoading = false;
            this.isLoadingWishlist = false;
            this._errorHandler(err);
          });
        }, err => {
          this.isLoading = false;
          this.isLoadingWishlist = false;
          this._errorHandler(err);
        })
      }
      else {
        this.wishlistService.getWishlistFromServer().subscribe(res => {
          res.products.map(product => {
            if (product.productId !== null) {
              this.totalPrice += +product.productId?.currentPrice * +product.quantity;
              this.quantity += +product.quantity;
            }
          })
          this.wishlistService.serverWishlist$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
          res.products.forEach((product: any) => {
            if (product.productId !== null) {
              this.wishlistItems.push({
                product: product.productId,
                quantity: product.quantity,
                size: product.size
              });
            }
          })
          this.isLoading = false;
          this.isLoadingWishlist = false;
        }, err => {
          this.isLoading = false;
          this.isLoadingWishlist = false;
          this._errorHandler(err);
        });
      }
    }, 500);
  }

  onCheckOut() {
    this.authService.isUserCheckingOut = true;
    this.router.navigate(['/checkout'])
  }

  onAddtoCart(wishlistItem: any, index: number) {
    this.bagType = 'cart';
    const cartItem = {
      productId: wishlistItem.product._id,
      quantity: wishlistItem.quantity,
      size: wishlistItem.size
    }

    if (!this.authService.isUserLoggedIn()) {
      this.cartService.setCartToLocalStorage(cartItem);
      this.onDeleteItemFromWishlist(wishlistItem.product._id, index, wishlistItem.product.currentPrice, wishlistItem.quantity);
      this.isSnackbarShown = true;
      // this.messageService.add({severity:'success', summary:'Success', detail: 'Cart updated'});
    }
    else {
      // if user is logged in
      this.isLoadingCart = true;
      this.cartService.postCart(cartItem, true).subscribe((res: PostCartResponse) => {
        this.isLoadingCart = false;
        this.cartService.serverCart$.next({totalPrice: +res.totalPrice, quantity: +res.quantity});
        this.onDeleteItemFromWishlist(wishlistItem.product._id, index, wishlistItem.product.currentPrice, wishlistItem.quantity);
        this.isSnackbarShown = true;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoadingCart = false;
        this._errorHandler(err);
      })
    }
  }
}
