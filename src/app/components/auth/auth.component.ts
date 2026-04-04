import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  errorMessage = '';
  successMessage = '';
  private authService = inject(AuthService);
  private router = inject(Router);

  authData = { username: '', email: '', password: '', confirmPassword: '' };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    // Validate form
    if (!this.authData.email || !this.authData.password) {
      this.errorMessage = "Email and password are required!";
      return;
    }

    if (!this.isLoginMode) {
      // Signup mode
      if (!this.authData.username) {
        this.errorMessage = "Username is required!";
        return;
      }
      
      if (this.authData.password !== this.authData.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      // Send User object for signup
      const signupData = {
        username: this.authData.username,
        email: this.authData.email,
        password: this.authData.password
      };

      this.authService.register(signupData).subscribe({
        next: (res) => {
          console.log('Signup successful');
          this.successMessage = 'Signup successful! Redirecting to login...';
          setTimeout(() => {
            this.isLoginMode = true;
            this.authData = { username: '', email: '', password: '', confirmPassword: '' };
            this.successMessage = '';
          }, 2000);
        },
        error: (err) => {
          console.error('Signup error:', err);
          this.errorMessage = err.error?.message || err.message || "Signup failed. Please try again.";
        }
      });

    } else {
      // Login mode
      // Send AuthDtoRequest for signin
      const loginData = {
        email: this.authData.email,
        password: this.authData.password
      };

      this.authService.login(loginData).subscribe({
        next: (token) => {
          console.log('Login successful, token:', token);
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (err) => {
          console.error('Login error:', err);
          this.errorMessage = err.error?.message || err.message || "Login failed. Invalid credentials.";
        }
      });
    }
  }
}