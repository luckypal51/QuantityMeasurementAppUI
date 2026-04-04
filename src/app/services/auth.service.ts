import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/auth';

  // Signup - expects User object, returns token as string
  register(userData: any): Observable<string> {
    console.log('Sending signup request to:', `${this.apiUrl}/signup`);
    return this.http.post(`${this.apiUrl}/signup`, userData, { responseType: 'text' }).pipe(
      tap((token: string) => {
        console.log('Signup response:', token);
        if (token && token.trim()) {
          localStorage.setItem('token', token.trim());
          console.log('✓ Token saved successfully');
        }
      }),
      catchError((error: any) => {
        console.error('Signup error:', error);
        return throwError(() => error);
      })
    );
  }

  // Signin - expects AuthDtoRequest, returns token as string
  login(credentials: any): Observable<string> {
    console.log('Sending login request to:', `${this.apiUrl}/signin`);
    return this.http.post(`${this.apiUrl}/signin`, credentials, { responseType: 'text' }).pipe(
      tap((token: string) => {
        console.log('Login response:', token);
        if (token && token.trim()) {
          localStorage.setItem('token', token.trim());
          console.log('✓ Token saved successfully');
        }
      }),
      catchError((error: any) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}