import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userSignUp } from 'src/app/Models/Request/UserSignUp';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

   constructor(public _authClient:UserLoginService, public _route:Router) { }

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  signUp(sign:userSignUp) {
    this._authClient.signUp(sign);
  }

  closeForm() {
    this._route.navigate(['/']);
  }

}
