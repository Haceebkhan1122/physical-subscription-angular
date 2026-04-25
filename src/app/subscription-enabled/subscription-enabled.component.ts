import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscription-enabled',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './subscription-enabled.component.html',
  styleUrl: './subscription-enabled.component.css'
})
export class SubscriptionEnabledComponent {


  logoImage: string = 'assets/images/meri-sehat-logo.svg';
  call: string = 'assets/images/call.svg';
  arrowDown: string = 'assets/images/down-black.svg';
  checkicon: string = 'assets/images/check.svg';
  icon01: string = 'assets/images/icon01.svg';
  icon001: string = 'assets/images/icon001.svg';
  icon002: string = 'assets/images/icon002.svg';
  icon003: string = 'assets/images/icon003.svg';
  icon004: string = 'assets/images/icon004.svg';
  icon0011: string = 'assets/images/icon0011.svg';
  icon0012: string = 'assets/images/icon0012.svg';
  icon0013: string = 'assets/images/icon0013.svg';
  error: string = 'assets/images/error.svg';
  toasticon: string = 'assets/images/toasticon.svg';
  vitals: string = 'assets/images/vitals.svg';
  health_insurance: string = 'assets/images/health-insurance.svg';
  consults: string = 'assets/images/consults.svg';
  loader: string = 'assets/images/loader_gif1.gif';
  csvIcon: string = 'assets/images/csv.png';
  cross: string = 'assets/images/cross.svg';
  editIcon: string = 'assets/images/editt.svg';
  deleteIcon: string = 'assets/images/delete.svg'; 
  private baseUrl = environment.BASE_URL;
  userRole: string | undefined; // Add 'undefined' as a type
  enabledSubscriptions: any;
  currentUrl: string = '';

  constructor(private cookieService: CookieService, private router: Router, private http: HttpClient){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    // Get the value of the 'access_token' cookie
    const accessToken = this.cookieService.get('access_token');
    // Initialize userRole when the component is created
    this.userRole = this.cookieService.get('user_role');


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    });
   
    // Make HTTP GET request to fetch city data
    const apiUrl = `${this.baseUrl}/customer-support/bulk-direct-subscription-enabled-list`;
    this.http.get(apiUrl, { headers: headers }).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.enabledSubscriptions = res.data.data;
        } else {
          // console.log(res);
        }
      },
      (error) => {
        // console.log('Error in HTTP request:', error);
        Swal.fire({
          icon: 'error',
          // title: 'Subscription Created Unsuccessfuly',
          text: error.error.message,
        });
        window.location.href = "/login"
      }
    );
  }

  isActive(route: string): boolean {
    if(this.currentUrl == '/'){
      return true;
    }
    return this.currentUrl === route;
  }
   
  goBack() {
    this.router.navigate(['/subscription-list']);
  }


}

