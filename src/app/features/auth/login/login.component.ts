import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Mail, Lock, LogIn, Chrome } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly LoginIcon = LogIn;
  readonly GoogleIcon = Chrome;

  email: string = '';
  pass: string = '';
  loading: boolean = false;
  error: string = '';

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.login(this.email, this.pass);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async googleLogin() {
    this.loading = true;
    try {
      await this.authService.googleLogin();
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }
}
