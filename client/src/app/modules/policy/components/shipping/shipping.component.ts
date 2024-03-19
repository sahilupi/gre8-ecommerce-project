import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  ngOnInit(): void {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
  }
}
