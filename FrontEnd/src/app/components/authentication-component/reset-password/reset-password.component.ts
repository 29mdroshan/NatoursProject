import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPassword } from 'src/app/Models/Request/ResetPassword';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  constructor(public _route:Router, public _userLoginClient:UserLoginService) { }

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  closeForm() {
    this._route.navigate(['/']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword(passwordResetForm: any) {
    let resetPassword= new ResetPassword(passwordResetForm.password, passwordResetForm.passwordConfirm);
    this._userLoginClient.resetPassword(resetPassword, passwordResetForm.token);
  }

}
