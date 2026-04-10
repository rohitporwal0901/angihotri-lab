import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Lock, UserPlus, Chrome } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly UserIcon = User;
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly SignupIcon = UserPlus;
  readonly GoogleIcon = Chrome;

  name: string = '';
  email: string = '';
  pass: string = '';
  loading: boolean = false;
  error: string = '';

  async onSubmit() {
    this.loading = true;
    this.error = '';
    try {
      await this.authService.signup(this.email, this.pass, this.name);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.loading = false;
    }
  }

  async googleSignup() {
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
