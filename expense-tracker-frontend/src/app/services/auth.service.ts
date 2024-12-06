// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
       apiUrl = 'http://localhost:7044/api/Authentication/';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Register method
  register(email: string, password: string, fullName: string, budget: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, fullName, budget });
  }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // Store user information after login
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Get current user info
  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }
}
