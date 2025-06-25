import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotPassword } from 'src/app/Models/Request/ForgotPassword';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(public _authClient:UserLoginService, public _route:Router) {}

  forgotPassword(email:ForgotPassword) {
    this._authClient.forgotPassword(email)
    alert("Password reset link has been sent to your email");
    this._route.navigate(['/resetPassword']);
  }

}
