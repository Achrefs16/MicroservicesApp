import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://microservicesapp.duckdns.org/api/orders/api/orders'; 

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getOrders(): Observable<any> {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      throw new Error('No admin token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.apiUrl, { headers });
  }
}
