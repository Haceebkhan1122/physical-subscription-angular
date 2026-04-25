import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SubscriptionsComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent {
  title = 'physical-subscription';

  constructor(private cookieService: CookieService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const accessToken = this.cookieService.get('access_token');
    if (!accessToken) {
      // Store the intended URL in session storage
      sessionStorage.setItem('intendedUrl', state.url);
      // Redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}

