import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserLoginService } from 'src/app/service-layer/login/user-login.service';
import { SharedServiceService } from 'src/app/service-layer/shared-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-overview-header',
  templateUrl: './overview-header.component.html',
  styleUrls: ['./overview-header.component.css']
})

export class OverviewHeaderComponent implements OnInit {

  jwt: any;
  userInfo$: any;
  userName: any = "";
  userPhoto: any = "";
  searchValue?:any
  showSearchBar: boolean = true; 
  private routerSubscription: any;

  constructor(public authService: UserLoginService, public _sharedService: SharedServiceService, public router: Router
    ,private activatedRoute: ActivatedRoute,
  ) {
    this.userName = sessionStorage.getItem('user-name') || '';
    this.userPhoto = sessionStorage.getItem('user-photo') || '';
    this.userInfo$ = this.authService.user$.pipe();
    this.userInfo$.subscribe((data: any) => {
      if(data != null) {
        this.userName = data.name;
        if(data.photo == null || data.photo == '' || data.photo == undefined) {
          this.userPhoto = 'defaultUser.jpg';
        } else {
          this.userPhoto = data.photo;
        }
      }
    })

    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Listen only to NavigationEnd events
      )
      .subscribe(() => {
        const currentRoute = this.router.url;

        // If the current route is just '/' (home), show the search bar
        // If the route is dynamic (e.g. contains a tour ID), hide the search bar
        const isHomeRoute = currentRoute === '/';
        const isTourRoute = /\/[a-zA-Z0-9]+$/.test(currentRoute); // Simple regex for tour ID

        if (isHomeRoute || !isTourRoute) {
          this.showSearchBar = true; // Show search bar on home or other routes
        } else {
          this.showSearchBar = false; // Hide search bar on tour pages
        }
      });
  
  }

  ngOnInit(): void {
    this.jwt = sessionStorage.getItem('jwt');
    
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onSearchChange() {
    this._sharedService.updateSearchValue(this.searchValue);
  }

   
  logout() {
   Swal.fire({
       title: 'Are you sure?',
        text: 'You will be logged out!',
        imageUrl: '/assets/img/icon/logout.jpg',
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Custom warning icon',
        background: 'white', // White background
        color: 'black', // Black text
        showCancelButton: true,
        confirmButtonColor: 'black', // Black confirm button
        cancelButtonColor: 'white', // White cancel button
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            // Actions on confirmation
            this.userName = "";
            this.userPhoto = "";
            this.authService.logout();
            Swal.fire(
                'Logged Out!',
                'You have been logged out successfully.',
                'success'
            );
        }
    });
    
  }

}
