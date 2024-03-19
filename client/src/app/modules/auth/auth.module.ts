import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReqResetPassComponent } from './components/req-reset-pass/req-reset-pass.component';
import { ResponseResetComponent } from './components/response-reset/response-reset.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, title: 'User Login - Gre8'
  },
  {
    path: 'register', component: RegisterComponent, title: 'User Register - Gre8'
  },
  {
    path: 'reset-password', component: ReqResetPassComponent, title: 'Reset Password - Gre8'
  },
  {
    path: 'response-reset-password/:token', component: ResponseResetComponent, title: 'Update Password - Gre8'
  }
]

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ReqResetPassComponent,
    ResponseResetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class AuthModule { }
