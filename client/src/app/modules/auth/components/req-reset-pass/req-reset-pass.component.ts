import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-req-reset-pass',
  templateUrl: './req-reset-pass.component.html',
  styleUrls: ['./req-reset-pass.component.scss']
})
export class ReqResetPassComponent {

  RequestResetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;
  isLoading = false;

  constructor( private userService: UserService ) { }

  ngOnInit() {
    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }

  RequestResetUser() {
    this.errorMessage = '';
    this.successMessage = '';
    this.RequestResetForm.value.domain = environment.domain;
    if (this.RequestResetForm.valid) {
      this.IsvalidForm = true;
      this.isLoading = true;
      this.userService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.isLoading = false;
          this.successMessage = "Reset password link sent to email sucessfully.";
        },
        err => {
          this.isLoading = false;
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }

  onClearMsg() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
