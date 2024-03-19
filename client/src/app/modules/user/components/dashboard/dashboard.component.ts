import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userFormGroup: FormGroup;
  isSubmitted = false;
  isLoading = false;
  serverErrMsg: string;
  serverSuccessMsg: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this._initCheckoutForm();
    this._getUserProfile();
    this._scrollTop();
  }

  private _initCheckoutForm() {
    this.userFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: [''],
      city: [''],
      country: [''],
      postalCode: [''],
      apartment: [''],
      address1: [''],
      company: [''],
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  private _getUserProfile() {
    this.isLoading = true;
    this.userService.getUserProfile().subscribe(res => {
      this.isLoading = false;
      this.userFormGroup.patchValue({
        name: res['user'].name,
        email: res['user'].email,
        phone: res['user'].phone,
        company: res['user'].company,
        city: res['user'].address?.city,
        country: res['user'].address?.country,
        postalCode: res['user'].address?.zip,
        address1: res['user'].address?.street,
        apartment: res['user'].address?.apartment
      });

    }, err => {
      this.isLoading = false;
      this._errorHandler(err);
    });
  }

  onUpdateProfile() {
    this.serverErrMsg = '';
    this.serverSuccessMsg = '';
    if(!this.userFormGroup.valid) {
      this._scrollTop();
      return;
    };
    this.isLoading = true;
    this.userService.updateUserProfile(this.userFormGroup.value).subscribe(res => {
      this.serverSuccessMsg = res['message'];
      this.userService.userName.next(res['user'].name);
      this.isLoading = false;
      this._scrollTop();
    }, err => {
      this.isLoading = false;
      this._errorHandler(err)
    })
  }

  private _errorHandler(err: HttpErrorResponse) {
    if (err.error['message']) {
      this.serverErrMsg = err.error['message'];
    }
    else if (err.error.code === 11000) {
      this.serverErrMsg = "An account with this email exists already. Please choose a different one"
    } else {
      this.serverErrMsg = 'Error while updating profile. Please try again!';
    }
  }

  get f() {
    return this.userFormGroup.controls;
  }

  private _scrollTop(){
    window.scrollTo({
      top: 0
    });
  }
}
