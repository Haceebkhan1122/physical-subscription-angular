import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  logoImage: string = 'assets/images/meri-sehat-logo.svg';
  loginLeft: string = 'assets/images/login-left.png';
  loader: string = 'assets/images/loader_gif1.gif';
  visiblePassword: string = 'assets/images/visiblePassword.svg';
  private baseUrl = environment.BASE_URL;


  getImageHTML(): string {
    return `<img src="${this.visiblePassword}" style="margin-top: -10px;" class="rounded me-2" alt="...">`;
  }

  getIconHTML(): string {
    return '<i class="fas fa-eye-slash"></i>';
  }


  loginObj: Login;
  hidePassword: boolean = true;
  nameError: string = '';
  passwordError: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.loginObj = new Login();
  }
  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
  isInputTouched: boolean = false;
  isInputTouchedPassword: boolean = false;


  checkNameLength() {
    this.isInputTouched = true;
    const nameLength = this.loginObj.name.length;
  }
  checkPasswordLength() {
    this.isInputTouchedPassword = true;
    const nameLength = this.loginObj.password.length;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // Prevent the default form submission behavior
      event.preventDefault();
      // Optionally, you can call another function here or leave it empty
    }
  }

  onLogin(event: Event) {
    event.preventDefault();

    if (this.loginObj.name === '') {
      this.nameError = "Name is Required";
      return; // Stop further execution
    } else {
      this.nameError = ''; // Clear name error if name is provided
    }

    if (this.loginObj.password === "") {
      this.passwordError = "Password is Required";
      return; // Stop further execution
    } else {
      this.passwordError = ''; // Clear password error if password is provided
    }

    this.loading = true

    const apiUrl = `${this.baseUrl}/customer-support/customer-login`;
    this.http.post(apiUrl, this.loginObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loading = false
          this.cookieService.set('access_token', res.data.user.access_token);
          this.cookieService.set('user_role', res.data.user.role.slug);
          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            text: res.message,
            timer: 2000,
          }).then(() => {
            // Redirect to subscription page
            this.router.navigate(['/subscription']);
          });
        } else {
          this.loading = false
          console.log(res);
        }
      },
      (error) => {
        this.loading = false
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: error.error.message,
        });
      }
    );
  }
}
export class Login {
  name: string;
  password: string;

  constructor() {
    this.name = '';
    this.password = '';
  }


}