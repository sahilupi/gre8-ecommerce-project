import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartComponent } from './components/cart/cart.component';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

@NgModule({
  declarations: [
    HomeComponent,
    CartComponent,
    CheckoutComponent,
    ContactComponent,
    AboutComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    CarouselModule,
    SharedModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress' }),
    RouterModule,
    ReactiveFormsModule
  ]
})
export class CoreModule { }
