import { Component, inject, signal, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, User, Mail, Lock, Plus, X } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-technician',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <!-- Close Button -->
        <button (click)="close.emit()" class="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
            <lucide-icon [name]="XIcon" class="w-6 h-6"></lucide-icon>
        </button>

        <div class="mb-10">
            <div class="w-16 h-16 bg-brand-teal rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-brand-teal/20">
                <lucide-icon [name]="PlusIcon" class="w-8 h-8"></lucide-icon>
            </div>
            <h2 class="text-3xl font-black text-slate-900 mb-2">New Technician</h2>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Create an official staff account</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div class="space-y-4">
                <div class="relative group">
                    <input type="text" [(ngModel)]="name" name="name" required
                           class="w-full px-12 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-brand-teal focus:bg-white transition-all"
                           placeholder="Full Name">
                    <lucide-icon [name]="UserIcon" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal w-5 h-5 transition-colors"></lucide-icon>
                </div>

                <div class="relative group">
                    <input type="email" [(ngModel)]="email" name="email" required
                           class="w-full px-12 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-brand-teal focus:bg-white transition-all"
                           placeholder="Email Address">
                    <lucide-icon [name]="MailIcon" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal w-5 h-5 transition-colors"></lucide-icon>
                </div>

                <div class="relative group">
                    <input type="password" [(ngModel)]="password" name="password" required
                           class="w-full px-12 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 placeholder-slate-300 focus:ring-2 focus:ring-brand-teal focus:bg-white transition-all"
                           placeholder="Initial Password">
                    <lucide-icon [name]="LockIcon" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-teal w-5 h-5 transition-colors"></lucide-icon>
                </div>
            </div>

            <div *ngIf="error()" class="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-black border border-red-100 flex items-center gap-2 animate-shake">
                <span class="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                {{error()}}
            </div>

            <button type="submit" [disabled]="loading()"
                    class="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-brand-teal transition-all active:scale-95 disabled:opacity-50 mt-4">
                <span *ngIf="!loading()">Create Technician Account</span>
                <div *ngIf="loading()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            </button>
        </form>
      </div>
    </div>
  `
})
export class AddTechnicianComponent {
  private authService = inject(AuthService);
  
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  name = '';
  email = '';
  password = '';
  
  loading = signal(false);
  error = signal('');

  readonly UserIcon = User;
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly PlusIcon = Plus;
  readonly XIcon = X;

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');
    
    try {
        // Since we are in a client app, creating a user usually logs out the admin.
        // We will call signup with role 'Technician'
        // For the sake of this demo, we'll assume the admin knows they will be logged out
        // or we use a custom method if it were a real backend.
        await this.authService.signup(this.email, this.password, this.name, 'Technician');
        this.success.emit();
        this.close.emit();
    } catch (err: any) {
        this.error.set(err.message || 'Failed to create technician');
    } finally {
        this.loading.set(false);
    }
  }
}
