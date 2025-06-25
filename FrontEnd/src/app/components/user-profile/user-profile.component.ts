import { Component } from '@angular/core';
import { UserLoginService } from '../../service-layer/login/user-login.service';
import { ActivatedRoute, Router } from '@angular/router';

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
