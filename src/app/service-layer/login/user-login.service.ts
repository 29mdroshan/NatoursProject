import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { ForgotPassword } from 'src/app/Models/Request/ForgotPassword';
import { ResetPassword } from 'src/app/Models/Request/ResetPassword';
import { UserLogin } from 'src/app/Models/Request/UserLogin';
import { userSignUp } from 'src/app/Models/Request/UserSignUp';


@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private apiUrl = 'http://localhost:4500/api/v1/user';
  
  public userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();

  public searchTour?: any;

  constructor(private _httpClient: HttpClient, private _router: Router) { }

  login(userLogin: UserLogin) {
    this._httpClient.post<any>(`${this.apiUrl}/login`, userLogin, { withCredentials: true })
    .pipe(
      switchMap((data: any) => {
        
        sessionStorage.setItem("jwt", data.token);
  
        return this.getUserInfo();
      }),
      catchError(err => {
        if(err.status === 404 && err.error.message.includes(`You don't have a account, Please Sign Up`)) {
          alert("You don't have a account, Please Sign Up");
          this._router.navigate(['/signup']);
          return of(null);
        }

        if(err.status === 401) {
          alert("Invalid credentials");
          console.error('Login or fetching user info failed', err);
          return of(null);
        }
        console.error('Login Failed', err);

        return of(null);
      })
    ).subscribe(userInfo => {
      if (userInfo) {
        sessionStorage.setItem("user-name", userInfo.data.data.name);
        sessionStorage.setItem("user-photo", userInfo.data.data.photo);
        sessionStorage.setItem("user-email", userInfo.data.data.email);
        sessionStorage.setItem("user-role", userInfo.data.data.role);
        this._router.navigate([''], { replaceUrl: true });
      }
      
    });
  }

  signUp(userSignUp: userSignUp) {
    this._httpClient.post<any>(`${this.apiUrl}/signup`, userSignUp,  { withCredentials: true }).pipe(
      switchMap((data: any) => {
        
        sessionStorage.setItem("jwt", data.token);
  
        return this.getUserInfo();
      }),
      catchError(err => {
        console.error('Sign UP Failed', err);
         
        return of(null);
      })
    ).subscribe(userInfo => {
      if (userInfo) {
        sessionStorage.setItem("user-name", userInfo.data.data.name);
        sessionStorage.setItem("user-photo", userInfo.data.data.photo);
        sessionStorage.setItem("user-email", userInfo.data.data.email);
        sessionStorage.setItem("user-role", userInfo.data.data.role);
      }
      this._router.navigate([''], { replaceUrl: true });
    });
  }

  forgotPassword(email: ForgotPassword) {
    this._httpClient.post<any>(`${this.apiUrl}/forgotPassword`, email,  { withCredentials: true }).subscribe(data => {
    });
  }

  resetPassword(resetPassword: ResetPassword, token: string) {
    this._httpClient.patch<any>(`${this.apiUrl}/resetPassword/${token}`, resetPassword,  { withCredentials: true }).pipe(
      switchMap((data: any) => {
        
        sessionStorage.setItem("jwt", data.token);

        alert("Password reset successfully");
  
        return this.getUserInfo();
      }),
      catchError(err => {
        console.error('Password reset failed', err);
         
        return of(null);
      })
    ).subscribe(userInfo => {
      if (userInfo) {
        sessionStorage.setItem("user-name", userInfo.data.data.name);
        sessionStorage.setItem("user-photo", userInfo.data.data.photo);
      }
      this._router.navigate([''], { replaceUrl: true });
    });
  }

  getUserInfo(): Observable<any> {
    const token = sessionStorage.getItem('jwt');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._httpClient.get<any>(`${this.apiUrl}/me`, { headers, withCredentials: true }).pipe(
      tap((userInfo) => {

        sessionStorage.setItem('user-name', userInfo.data.data.name);
        sessionStorage.setItem('user-photo', userInfo.data.data.photo);

        this.userSubject.next(userInfo.data.data);
      }),
      catchError((error) => {
        console.error('Fetching user info failed', error);
        this.logout();
        return of(null);
      })
    );
  }

  logout(): void {
    this._httpClient.get<any>(`${this.apiUrl}/logout`, { withCredentials: true }).subscribe(data=>{
    });

    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('user-name');
    sessionStorage.removeItem('user-photo');
    sessionStorage.removeItem("user-email");
    sessionStorage.removeItem("user-role");
    
    this.userSubject.next(null);

    this._router.navigate(['']);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  refreshUser(userData: any) {
    this.userSubject.next(userData);
  }

  updatePassword(currentPassword: string, newPassword: string, passwordConfirm: string): Observable<any> {
    return this._httpClient.patch<any>(
      `${this.apiUrl}/updatePassword`, 
      { 
        currentPassword, 
        newPassword, 
        passwordConfirm 
      }, 
      { withCredentials: true }
    );
  }
}
