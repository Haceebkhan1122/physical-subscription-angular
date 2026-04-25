import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {
  private baseUrl = 'https://portal.merisehat.pk/portal/api/v2';

  constructor(private http: HttpClient) { }

  users(username: string, password: string) {
    const postData = {
      username: username,
      password: password
    };

    // Concatenate the baseUrl with the specific endpoint
    const apiUrl = `${this.baseUrl}/customer-support/customer-login`;

    // Make the POST request with the data
    return this.http.post(apiUrl, postData);
  }
}