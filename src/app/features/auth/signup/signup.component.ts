import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  phone = '';
  loading = false;
  error = '';
  showPassword = false;

  async signup() {
    if (!this.email || !this.password || !this.name) {
        this.error = 'Please fill all required fields.';
        return;
    }
    this.loading = true;
    this.error = '';
    try {
      // Role defaults to 'user' for patients
      await this.authService.signup(this.email, this.password, this.name, 'user');
    } catch (e: any) {
      this.error = e.message || 'Registration failed. Try again.';
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
      this.loading = true;
      try {
          await this.authService.googleLogin('user');
      } catch (e) {
          this.error = 'Google registration failed.';
      } finally {
          this.loading = false;
      }
  }
}
