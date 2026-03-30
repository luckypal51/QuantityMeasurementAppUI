import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/v1/auth';

  private extractToken(response: any): string | null {
    // Try multiple token field names
    if (response?.token) return response.token;
    if (response?.data?.token) return response.data.token;
    if (response?.accessToken) return response.accessToken;
    if (response?.access_token) return response.access_token;
    if (response?.jwtToken) return response.jwtToken;
    
    // If response is a string (raw token), return it
    if (typeof response === 'string') return response;
    
    return null;
  }

  register(userData: any): Observable<any> {
    console.log('Sending signup request to:', `${this.apiUrl}/signup`);
    return this.http.post(`${this.apiUrl}/signup`, userData, { responseType: 'text' }).pipe(
      tap((res: any) => {
        console.log('Signup raw response:', res);
        // Try to parse if it's a string
        let parsedRes = res;
        if (typeof res === 'string') {
          try {
            parsedRes = JSON.parse(res);
          } catch (e) {
            console.error('Failed to parse signup response as JSON:', e);
          }
        }
        console.log('Signup parsed response:', parsedRes);
      }),
      catchError((error: any) => {
        console.error('Signup error:', error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: any): Observable<any> {
    console.log('Sending login request to:', `${this.apiUrl}/signin`);
    return this.http.post(`${this.apiUrl}/signin`, credentials, { responseType: 'text' }).pipe(
      tap((res: any) => {
        console.log('Raw response:', res);
        // Try to parse if it's a string
        let parsedRes = res;
        if (typeof res === 'string') {
          try {
            parsedRes = JSON.parse(res);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
          }
        }
        
        const token = this.extractToken(parsedRes);
        if (token) {
          localStorage.setItem('token', token);
          console.log('✓ Token saved successfully');
        } else {
          console.warn('⚠ Token not found in response:', parsedRes);
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