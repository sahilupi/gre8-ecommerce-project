import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthGuard } from 'src/app/shared/services/auth/user-auth-guard';
import { OrderDetailsComponent } from './components/orders/order-details/order-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: ShellComponent,
    canActivate: [UserAuthGuard],
    children: [
      {
        path: 'dashboard', component: DashboardComponent, title: 'User dashboard - Gre8', canActivate: [UserAuthGuard]
      },
      {
        path: 'orders', component: OrdersComponent, title: 'User Orders - Gre8', canActivate: [UserAuthGuard]
      },
      {
        path: 'orders/order/:id', component: OrderDetailsComponent, title: 'Order details - Gre8', canActivate: [UserAuthGuard]
      }
    ]
  }
]

@NgModule({
  declarations: [
    DashboardComponent,
    OrdersComponent,
    ShellComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UserModule { }
