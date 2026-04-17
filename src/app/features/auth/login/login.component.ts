import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  async login() {
    if (!this.email || !this.password) {
        this.error = 'Please enter both email and password.';
        return;
    }
    this.loading = true;
    this.error = '';
    try {
      await this.authService.login(this.email, this.password);
    } catch (e: any) {
      console.error('Login error:', e);
      this.error = 'Invalid credentials. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
      this.loading = true;
      try {
          await this.authService.googleLogin();
      } catch (e) {
          this.error = 'Google login failed.';
      } finally {
          this.loading = false;
      }
  }
}
