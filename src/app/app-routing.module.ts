import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponentComponent } from './components/overview/home-component/home-component.component';
import { ToursComponentComponent } from './components/overview/tours-component/tours-component.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { SignUpComponent } from './components/forms/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/authentication-component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/authentication-component/reset-password/reset-password.component';
import { ErrorComponent } from './components/utils/error/error.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MyReviewsComponent } from './components/my-account/my-reviews/my-reviews.component';
import { MySettingComponent } from './components/my-account/my-setting/my-setting.component';
import { MyBookingsComponent } from './components/my-account/my-bookings/my-bookings.component';
import { BookingFormComponent } from './components/forms/booking-form/booking-form.component';
import { AdminTourTableComponent } from './components/my-account/admin-tour-table/admin-tour-table.component';


const routes: Routes = [
  {
    path:'', component:HomeComponentComponent
  },
  {
    path:'home', component:HomeComponentComponent,
    children:[
      {
        path:':id', component:ToursComponentComponent
      },
]},
  {
    path: 'login', component: LoginFormComponent
  },
  {
    path: 'signup', component: SignUpComponent
  },
  {
    path: 'forgotPassword', component: ForgotPasswordComponent
  },
  {
    path: 'resetPassword', component: ResetPasswordComponent
  },
  {
    path: 'userProfile', component: UserProfileComponent,
    children:[
      {
        path:'mySetting', component:MySettingComponent
      },
      {
        path:'myReviews', component:MyReviewsComponent
      }, {
        path:'myReviews/:id', component:MyReviewsComponent
      },
      {
        path:'myBookings', component:MyBookingsComponent
      },
      {
        path:'adminTours', component:AdminTourTableComponent
      }
    ]
  },
  {
    path:':id', component:ToursComponentComponent
  },
  {
    path:'booking/:id', component:BookingFormComponent
  },
  {
    path:'error', component:ErrorComponent
  },
  {
    path:':id', component:ToursComponentComponent
  }
  // {
  //   path: 'view-movies', component: ViewMoviesComponent
  // },
  // {
  //   path: 'search-movies', component: SearchMoviesComponent
  // },
  // {
  //   path:'search-rating',component:SearchRatingComponent
  // }, {
  //   path: 'error', component: ErrorPageComponent
  // }, {
  //   path: '**', redirectTo: '/error'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
