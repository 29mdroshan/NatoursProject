import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewHeaderComponent } from './components/overview/overview-header/overview-header.component';
import { TourCardComponent } from './components/overview/tour-card/tour-card.component';
import { HomeComponentComponent } from './components/overview/home-component/home-component.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToursComponentComponent } from './components/overview/tours-component/tours-component.component';
import { LoginFormComponent } from './components/forms/login-form/login-form.component';
import { TourFilterPipeDirective } from './components/utils/custom-pipes/tour-filter-pipe.directive';
import { FooterComponent } from './components/overview/footer/footer.component';
import { SignUpComponent } from './components/forms/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/authentication-component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/authentication-component/reset-password/reset-password.component';
import { ErrorComponent } from './components/utils/error/error.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyReviewsComponent } from './components/my-account/my-reviews/my-reviews.component';
import { MySettingComponent } from './components/my-account/my-setting/my-setting.component';
import { MyBookingsComponent } from './components/my-account/my-bookings/my-bookings.component';
import { BookingFormComponent } from './components/forms/booking-form/booking-form.component';
import { ReviewCardComponent } from './components/my-account/my-reviews/review-card/review-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReviewDialogComponent } from './components/utils/review-dialog/review-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminTourTableComponent } from './components/my-account/admin-tour-table/admin-tour-table.component'; // Import ReactiveFormsModule here

@NgModule({
  declarations: [
    AppComponent,
    OverviewHeaderComponent,
    TourCardComponent,
    HomeComponentComponent,
    ToursComponentComponent,
    LoginFormComponent,
    TourFilterPipeDirective,
    FooterComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ErrorComponent,
    UserProfileComponent,
    MyReviewsComponent,
    MySettingComponent,
    MyBookingsComponent,
    BookingFormComponent,
    ReviewCardComponent,
    ReviewDialogComponent,
    AdminTourTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
