import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLoginService } from '../../../service-layer/login/user-login.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  userRole: any = "";

  constructor(public authService: UserLoginService, public router: Router) {
      this.userRole = sessionStorage.getItem('user-role') || '';
  }
}
