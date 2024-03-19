import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CartProduct } from 'src/app/shared/models/cart.model';
import { Product } from 'src/app/shared/models/product.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CART_KEY, CartService, PostCartResponse } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';

interface PurchaseItems {
  name: string;
  productId: any;
  quantity: number;
  size: any;
  color: any;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products: Product[];
  cartItems: CartProduct[] = [];
  serverErrMsg: string;
  isLoadingCart = false;
  isLoading = false;
  isLoadingDelete = false;
  isLoadingUpdateQuantity = false;
  totalPrice: number = 0;
  quantity: number = 0;

  constructor(private productService: ProductService, private cartService: CartService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isLoadingCart = true;
    if (!this.authService.isUserLoggedIn()) {
      this._getLocalStorageCart();
    }
    else {
      this._getCartFromServer();
    }
    this.scrollTop();
  }

  private _getLocalStorageCart() {
    this.cartService.cart$.pipe(take(1)).subscribe(respCart => {
      if (respCart && respCart.items.length > 0) {
        respCart.items.forEach(cartItem => {
          this.productService.getProduct(cartItem.productId).subscribe(res => {
            this.cartItems.push({
              product: res['product'],
              quantity: cartItem['quantity'],
              size: cartItem['size']
            });
            this.isLoadingCart = false;
          }, err => {
            this._errorHandler(err);
            this.isLoadingCart = false;
          });
        })
      }
      else {
        this.isLoadingCart = false;
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
      this.cartService.setCartToLocalStorage({
        quantity: +value,
        productId: product._id
      }, true);

      const filteredProduct = this.cartItems.filter(prod => prod.product._id === product._id);
      filteredProduct[0]['quantity'] = +value;
    }
    else {
      const cartItem = {
        productId: product._id,
        quantity: +value
      }
      this.isLoadingUpdateQuantity = true;
      this.cartService.postCart(cartItem).subscribe((res: PostCartResponse) => {
        this.cartService.serverCart$.next({ totalPrice: +res.totalPrice, quantity: +res.quantity });
        this.totalPrice = +res.totalPrice;
        this.quantity = +res.quantity;
        const filteredProduct = this.cartItems.filter(prod => prod.product._id === product._id);
        filteredProduct[0]['quantity'] = +value;
        this.subTotal();
        this.isLoadingUpdateQuantity = false;
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cart Updated' });
      }, err => {
        this.isLoadingUpdateQuantity = false;
        this._errorHandler(err);
      })
    }
  }

  onDeleteItemFromCart(productId: string, index: number, price: number, quantity: number) {
    this.isLoadingDelete = true;
    if (!this.authService.isUserLoggedIn()) {
      this.cartService.deleteItemFromCart(productId);
      this.cartItems.splice(index, 1);
      this.isLoadingDelete = false;
    }
    else {
      this.cartService.postDeleteProductCart(productId).subscribe(res => {
        this.isLoadingDelete = false;
        this.totalPrice = (this.totalPrice - (+price * +quantity));
        this.quantity = (this.quantity - quantity);
        this.cartService.serverCart$.next({ totalPrice: this.totalPrice, quantity: this.quantity });
        this.cartItems.splice(index, 1);
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      }, err => {
        this.isLoadingDelete = false;
        this._errorHandler(err);
      });
    }
  }

  subTotal() {
    return Number(this.cartItems.reduce((acc, item) => {
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

  private _getCartFromServer() {
    setTimeout(() => {
      const fetchedCart = localStorage.getItem(CART_KEY);
      // if cart is present in localstorage, store that in user account and clear localstorage cart
      if (fetchedCart && JSON.parse(fetchedCart).items && JSON.parse(fetchedCart).items.length > 0) {
        const cart = JSON.parse(fetchedCart);
        this.cartService.postMultipleCart(cart).subscribe(() => {
          this.cartService.emptyCart();
          this.cartService.getCartFromServer().subscribe(res => {

            res.products.forEach((product: any) => {
              this.totalPrice += +product.productId.currentPrice * +product.quantity;
              this.quantity += +product.quantity;
              this.cartItems.push({
                product: product.productId,
                quantity: product.quantity,
                size: product.size
              });
              this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
            })
            this.isLoading = false;
            this.isLoadingCart = false;
          }, err => {
            this.isLoading = false;
            this.isLoadingCart = false;
            this._errorHandler(err);
          });
        }, err => {
          this.isLoading = false;
          this.isLoadingCart = false;
          this._errorHandler(err);
        })
      }
      else {
        this.cartService.getCartFromServer().subscribe(res => {
          res.products.map(product => {
            if (product.productId !== null) {
              this.totalPrice += +product.productId?.currentPrice * +product.quantity;
              this.quantity += +product.quantity;
            }
          })
          this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
          res.products.forEach((product: any) => {
            if (product.productId !== null) {
              this.cartItems.push({
                product: product.productId,
                quantity: product.quantity,
                size: product.size
              });
            }
          })
          this.isLoading = false;
          this.isLoadingCart = false;
        }, err => {
          this.isLoading = false;
          this.isLoadingCart = false;
          this._errorHandler(err);
        });
      }
    }, 500);
  }

  onCheckOut() {
    this.authService.isUserCheckingOut = true;
    this.router.navigate(['/checkout'])
  }

  // onWhatsappCheckOut() {
  //   let checkoutMsg = 'Hi, I want to purchase Products - ';
  //   const purchasableItems: PurchaseItems[] = [];
  //   this.cartItems.map(cartItem => {
  //     purchasableItems.push({
  //       name: cartItem.product.name,
  //       quantity: cartItem.quantity,
  //       size: cartItem.size,
  //       color: cartItem.color,
  //       productId: cartItem.product._id
  //     })
  //   });
  //   purchasableItems.map(item => {
  //     checkoutMsg += '(Name: "' + item.name + '", ' + 'quantity: ' + item.quantity + ', ' + 'Product ID: ' + item.productId + '),,,, '
  //   });
  //   checkoutMsg = checkoutMsg.trim().slice(0, -1) + '---------------Total Price - ₹' + this.subTotal();
  //   location.href = "https://api.whatsapp.com/send?phone=+916304476247&text=" + checkoutMsg;
  // }
}
