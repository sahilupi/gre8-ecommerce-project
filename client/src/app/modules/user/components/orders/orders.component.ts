import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  orders: Order[];
  serverErrMsg: string;
  isLoading = false;
  isOrderPlaced = false;
  orderPlacedSub$: Subscription;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this._getUserOrders();
    this._scrollTop();
    this.orderPlacedSub$ = this.orderService.isOrderPlaced.subscribe(response => {
      this.isOrderPlaced = response;
    })
  }

  private _scrollTop() {
    window.scrollTo({
      top: 0
    })
  }

  private _getUserOrders() {
    this.isLoading = true;
    this.orderService.getUserOrders().subscribe(res => {
      this.orders = res['orders'];
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this._errorHandler(err);
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'Error while fetching orders. Please try again!';
    }
  }

  ngOnDestroy(): void {
    if (this.orderPlacedSub$) {
      this.orderPlacedSub$.unsubscribe();
    }
    this.orderService.isOrderPlaced.next(false);
  }
}
