import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductComponent } from './components/reususable-components/product/product.component';
import { CategoryComponent } from './components/reususable-components/category/category.component';
import { InputSpinnerComponent } from './components/ui-components/input-spinner/input-spinner.component';
import { FeaturedProductsComponent } from './components/reususable-components/featured-products/featured-products.component';
import { SearchComponent } from './components/ui-components/search/search.component';
import { SnackbarComponent } from './components/ui-components/snackbar/snackbar.component';
import { CategorySmallComponent } from './components/reususable-components/category-small/category-small.component';
import { CollectionComponent } from './components/reususable-components/collection/collection.component';
import { AccordionComponent } from './components/ui-components/accordion/accordion.component';
import { AccordionItemComponent } from './components/ui-components/accordion/accordion-item.component';
import { CartIconComponent } from './components/ui-components/cart-icon/cart-icon.component';
import { LoadingSpinnerComponent } from './components/ui-components/loading-spinner/loading-spinner.component';
import { OrderTrackingComponent } from './components/ui-components/order-tracking/order-tracking.component';
import { WishlistIconComponent } from './components/ui-components/wishlist-icon/wishlist-icon.component';

@NgModule({
  declarations: [
    ProductComponent,
    CategoryComponent,
    InputSpinnerComponent,
    FeaturedProductsComponent,
    SearchComponent,
    SnackbarComponent,
    CategorySmallComponent,
    CollectionComponent,
    AccordionComponent,
    AccordionItemComponent,
    CartIconComponent,
    LoadingSpinnerComponent,
    OrderTrackingComponent,
    WishlistIconComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ProductComponent,
    CategoryComponent,
    InputSpinnerComponent,
    FeaturedProductsComponent,
    SearchComponent,
    SnackbarComponent,
    CategorySmallComponent,
    CollectionComponent,
    AccordionComponent,
    AccordionItemComponent,
    CartIconComponent,
    LoadingSpinnerComponent,
    OrderTrackingComponent,
    WishlistIconComponent
  ]
})
export class SharedModule { }
