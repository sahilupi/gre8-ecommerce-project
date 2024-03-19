import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OrderItem } from 'src/app/shared/models/order-item.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

// import { StripeService } from 'ngx-stripe';
// import { Order } from 'src/app/shared/models/order.model';
// import { switchMap } from 'rxjs';

declare let Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  countries: { _id: string, name: string }[] = [];
  serverErrMsg: string;
  totalPrice: number = 0;
  quantity: number = 0;
  isLoading = false;
  submitted = false;
  razorPayResMsg: string;
  userId: string;
  razorOrderId: string = '';
  defaultCountry: string = 'India';

  razorPayOptions = {
    "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
    "amount": 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Younedia",
    "description": "Test Transaction",
    "image": "/assets/img/gret/gre8-logo.png",
    "order_id": "order_IluGWxBm9U8zJ8", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": (res: any) => {
      console.log(res);
    }
  }

  constructor(
    private router: Router,
    private usersService: UserService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getCartItems();
    this._getCountries();
    this._getUserProfile();
    this.scrolltop();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', Validators.required],
      company: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      apartment: ['', Validators.required],
      address1: ['', Validators.required],
      orderNotes: ['']
    });
    this.checkoutFormGroup.controls['country'].patchValue(this.defaultCountry)
  }

  private _getCartItems() {
    if (!this.authService.isUserLoggedIn()) {
      const cart = this.cartService.getCartItemsFromLocalStorage();
      this.orderItems = cart.items;
    }
    else {
      this.cartService.getCartFromServer().subscribe(res => {
        this.orderItems = res.products;
        res.products.forEach((product: any) => {
          this.totalPrice += +product.productId.price * +product.quantity;
          this.quantity += +product.quantity;
          this.cartService.serverCart$.next({ totalPrice: +this.totalPrice, quantity: this.quantity });
        })
      })
    }
  }

  private _getUserProfile() {
    this.isLoading = true;
    this.usersService.getUserProfile().subscribe(res => {
      this.isLoading = false;
      console.log(res['user'])
      this.checkoutFormGroup.patchValue({
        name: res['user'].name,
        email: res['user'].email,
        phone: res['user'].phone,
        city: res['user'].address?.city,
        country: res['user'].address?.country,
        postalCode: res['user'].address?.zip,
        address1: res['user'].address?.street,
        company: res['user'].company,
        apartment: res['user'].address?.apartment
      });

    }, err => {
      this.isLoading = false;
      this._errorHandler(err);
    });
  }

  subTotal() {
    return Number(this.orderItems.reduce((acc, item) => {
      return acc + (+item.productId.currentPrice * (item.productId.quantity ? +item.productId.quantity : +item.quantity));
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

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  get f() {
    return this.checkoutFormGroup.controls;
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'Error while placing order. Please try again!';
    }
  }

  scrolltop() {
    window.scrollTo({
      top: 0
    })
  }

  // createOrderSession() {
  //   this.isSubmitted = true;
  //   if (this.checkoutFormGroup.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   const order = {
  //     orderItems: this.orderItems,
  //     name: this.checkoutFormGroup.value.name,
  //     email: this.checkoutFormGroup.value.email,
  //     phone: this.checkoutFormGroup.value.phone,
  //     city: this.checkoutFormGroup.value.city,
  //     address1: this.checkoutFormGroup.value.address1,
  //     apartment: this.checkoutFormGroup.value.apartment,
  //     country: this.checkoutFormGroup.value.country,
  //     postalCode: this.checkoutFormGroup.value.postalCode,
  //     orderNotes: this.checkoutFormGroup.value.orderNotes,
  //     userId: 'userIdwillautomaticallycreatedonserver',
  //     _id: 'userIdwillautomaticallycreatedonserver',
  //     paymentStatus: 'Pending',
  //     sessionId: null,
  //     dateOrdered: `${Date.now()}`
  //   };

  //   const domain = environment.domain;
  //   // const ord = Object.assign({}, {order, domain: domain});
  //   this.orderService.createOrderSession(order, domain).pipe(
  //     switchMap((session:any) => {
  //       if (session.sessionId) {
  //         order.sessionId = session.sessionId;
  //         this.onPlaceOrder(order);
  //       }
  //       return this.stripeService.redirectToCheckout({ sessionId: session.sessionId })
  //     })
  //   ).subscribe(
  //     (result) => {
  //       //redirect to thank you page // payment
  //       this.isLoading = false;
  //     },
  //     (err) => {
  //       //display some message to user
  //       this._errorHandler(err);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  // onPlaceOrder(order: any) {
  //   this.orderService.postOrder(order).subscribe(
  //     (res) => {
  //       //redirect to thank you page // payment
  //       this.cartService.emptyCart();
  //       this.cartService.serverCart$.next({ totalPrice: 0, quantity: 0 });
  //       this.isLoading = false;
  //     },
  //     (err) => {
  //       //display some message to user
  //       this._errorHandler(err);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  onPlaceOrder() {
    this.isSubmitted = true;
    this.serverErrMsg = "";
    if (!this.checkoutFormGroup.valid) {
      console.log('form not valid');
      this.scrolltop()
      return;
    }
    this.isLoading = true;
    const formBody = {
      name: this.checkoutFormGroup.value.name,
      email: this.checkoutFormGroup.value.email,
      phone: this.checkoutFormGroup.value.phone,
      city: this.checkoutFormGroup.value.city,
    }
    const formObj = Object.assign({}, formBody, { domain: environment.domain });

    this.orderService.postPlaceOrder(formObj).subscribe((res: any) => {
      this.isLoading = false;
      this.userId = res['userId'];
      this.razorPayOptions.key = res['key'];
      this.razorPayOptions.amount = res['value']['amount'];
      this.razorPayOptions.name = res['name'];
      this.razorPayOptions.order_id = res['orderId'];
      this.razorPayOptions.currency = res['currency'];
      this.razorOrderId = res['orderId'];
      this.razorPayOptions.handler = this.razorPayResponseHandler.bind(this);
      let rzp1 = new Razorpay(this.razorPayOptions);
      rzp1.open(this.razorPayOptions);
    }, error => {
      this.isLoading = false;
      this._errorHandler(error);
    })
  }

  razorPayResponseHandler(res: any) {
    if (res) {
      this.isLoading = true;
      const formBody = {
        name: this.checkoutFormGroup.value.name,
        email: this.checkoutFormGroup.value.email,
        phone: this.checkoutFormGroup.value.phone,
        city: this.checkoutFormGroup.value.city,
        address1: this.checkoutFormGroup.value.address1,
        apartment: this.checkoutFormGroup.value.apartment,
        country: this.checkoutFormGroup.value.country,
        postalCode: this.checkoutFormGroup.value.postalCode,
        orderNotes: this.checkoutFormGroup.value.orderNotes
      }

      const formObj = Object.assign({}, formBody, { domain: environment.domain, order_id: this.razorOrderId, userId: this.userId, planUrl: this.router.url });

      this.orderService.postOrderResponse(formObj).subscribe((res: any) => {
        this.isLoading = false;
        this.razorPayResMsg = res['message'];
        this.cartService.serverCart$.next({ totalPrice: 0, quantity: 0 });
        this.orderService.isOrderPlaced.next(true);
        this.router.navigate(['/user/orders']);
      }, error => {
        this.isLoading = false;
        this._errorHandler(error);
      })
    }
  }
}
