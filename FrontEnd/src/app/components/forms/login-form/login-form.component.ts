import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogin } from 'src/app/Models/Request/UserLogin';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
   constructor(public _route:Router, public _userLoginClient:UserLoginService) { }

  showPassword: boolean = false;
  
  login(loginForm: UserLogin) {
    this._userLoginClient.login(loginForm);
  }

  closeForm() {
    this._route.navigate(['/']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
