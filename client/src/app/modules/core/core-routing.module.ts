import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserAuthGuard } from 'src/app/shared/services/auth/user-auth-guard';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, title: 'Gre8 - Books | Jewellery | Clothes'
  },
  {
    path: 'cart', component: CartComponent, title: 'Cart - Gre8'
  },
  {
    path: 'checkout', component: CheckoutComponent, title: 'User Checkout - Gre8', canActivate: [UserAuthGuard]
  },
  {
    path: 'contact-us', component: ContactComponent, title: 'Contact Us - Gre8'
  },
  {
    path: 'about', component: AboutComponent, title: 'About Us - Gre8'
  },
  {
    path: 'wishlist', component: WishlistComponent, title: 'Wishlist - Gre8'
  },
]
@NgModule({
  imports: [
    RouterModule.forChild(routes),
],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
