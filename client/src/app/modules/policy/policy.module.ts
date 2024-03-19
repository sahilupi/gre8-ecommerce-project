import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/terms/terms.component';
import { ReturnPolicyComponent } from './components/return-policy/return-policy.component';
import { ShippingComponent } from './components/shipping/shipping.component';

const routes: Routes = [
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent, title: 'Privacy Policy - Gre8'
  },
  {
    path: 'terms-conditions', component: TermsComponent, title: 'Terms and Conditions - Gre8'
  },
  {
    path: 'refund-policy', component: ReturnPolicyComponent, title: 'Returns and Refund Policy - Gre8'
  },
  {
    path: 'shipping', component: ShippingComponent, title: 'Shipping Policy - Gre8'
  }
]

@NgModule({
  declarations: [
    PrivacyPolicyComponent,
    TermsComponent,
    ReturnPolicyComponent,
    ShippingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PolicyModule { }
