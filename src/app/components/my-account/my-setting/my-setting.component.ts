import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service-layer/user/user.service';
import { User } from 'src/app/Models/Entity/User';
import Swal from 'sweetalert2';

import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';


export function passwordMatchValidator(controlName: string, matchingControlName: string, currentPasswordControl: AbstractControl): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (matchingControl?.errors && !matchingControl?.errors['passwordMismatch']) {
      return null;
    }

    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      matchingControl?.setErrors(null);
    }

    // Check if newPassword is not the same as currentPassword
    if (currentPasswordControl && control?.value === currentPasswordControl.value) {
      control?.setErrors({ passwordSameAsCurrent: true });
      return { passwordSameAsCurrent: true };
    } else {
      control?.setErrors(null);
      return null;
    }
  };
}


@Component({
  selector: 'app-my-setting',
  templateUrl: './my-setting.component.html',
  styleUrls: ['./my-setting.component.css']
})
export class MySettingComponent {
   userInfo$: any;
  userName: any = "";
  userPhoto: any = "";
  updatedUserPhoto: any = "";
  userEmail: any = "";
  userRole: any = "";
  updatePasswordForm: FormGroup;

  constructor(public authService: UserLoginService, public _userClient: UserService, public router: Router, private fb: FormBuilder) {
      this.updatePasswordForm = this.fb.group(
        {
          currentPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
          newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
          passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)]],
        },
        {
           validators: this.passwordMatchValidatorWithDelay()
        }
      );
      this.userName = sessionStorage.getItem("user-name") || '';
      this.userPhoto = sessionStorage.getItem('user-photo') || '';
      this.userEmail = sessionStorage.getItem('user-email') || '';
      this.userRole = sessionStorage.getItem('user-role') || '';
      this.userInfo$ = this.authService.user$.pipe();
      this.userInfo$.subscribe((data: any) => {
        if(data != null) {
          this.userName = data.name;
          this.userPhoto = data.photo;
          this.userEmail = data.email;
          this.userRole = data.role;
        }
      })
    
    }


  passwordMatchValidatorWithDelay(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const control = formGroup.get('newPassword');
      const matchingControl = formGroup.get('passwordConfirm');
      const currentPasswordControl = formGroup.get('currentPassword');

      // We need to ensure that form controls are initialized
      if (!control || !matchingControl || !currentPasswordControl) {
        return null;
      }

      return passwordMatchValidator('newPassword', 'passwordConfirm', currentPasswordControl)(formGroup);
    };
  }


  updateUser(userData: any) {
    let user :Partial<User> = {name: userData.name, email: userData.email};
    
    this._userClient.updateUser(user, this.updatedUserPhoto).subscribe({
      next: (response) => {
        if(response.status === 'success') {
          Swal.fire({
            title: 'Success',
            text: 'User updated successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          sessionStorage.setItem("user-name", response.data.user.name);
          sessionStorage.setItem("user-photo", response.data.user.photo);
          sessionStorage.setItem("user-email", response.data.user.email);
          sessionStorage.setItem("user-role", response.data.user.role);
          this.authService.refreshUser(response.data.user);
        }
        
      },
      error: (error) => {
        console.error("Error updating user: ", error);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.updatedUserPhoto = file;
    }
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmitPasswordChange() {
  const currentPassword = this.updatePasswordForm.get('currentPassword')?.value;
  const newPassword = this.updatePasswordForm.get('newPassword')?.value;
  const passwordConfirm = this.updatePasswordForm.get('passwordConfirm')?.value;

  // Call the service method to update the password
  this.authService.updatePassword(currentPassword, newPassword, passwordConfirm).subscribe(
    (response) => {
      if (response.status === 'success') {
        Swal.fire({
          title: 'Password Updated',
          text: 'Your password has been successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    },
    (error) => {
      console.error('Error updating password:', error);
      Swal.fire({
        title: 'Error',
        text: 'There was an issue updating your password. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });}
    );}
}
