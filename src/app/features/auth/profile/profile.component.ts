import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-12">
      <h1 class="text-3xl font-black italic">Patient Area</h1>
      <p class="text-slate-400 mt-2">Welcome to your diagnostic history portal.</p>
      <button (click)="logout()" class="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Logout</button>
    </div>
  `
})
export class ProfileComponent {
    authService = inject(AuthService);
    logout() { this.authService.logout(); }
}
