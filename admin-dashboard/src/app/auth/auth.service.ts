import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/api/auth/api/auth'; // Backend URL for admin

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminsignin`, { email, password });
  }
}
