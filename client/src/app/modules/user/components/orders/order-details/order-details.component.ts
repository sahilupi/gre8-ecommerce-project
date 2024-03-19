import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string;
  orderStatus: string;
  serverErrMsg: string;
  order: Order;
  isLoading = false;

  constructor( private activatedRoute: ActivatedRoute, private orderService: OrderService ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      if(params['id']) {
        this.orderId = params['id'];
        this._getOrder(this.orderId);
      }
    })
      window.scrollTo({
        top: 0
      })
  }

  private _getOrder(orderId: string) {
    this.isLoading = true;
    this.orderService.getOrder(orderId).subscribe(res => {
      this.order = res['order'];
      this.orderStatus = res['order'].status;
      this.isLoading = false;
    }, err => {
      this._errorHandler(err);
      this.isLoading = false;
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    } else {
      this.serverErrMsg = 'Error while fetching order. Please try again!';
    }
  }
}
