import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Clock, Navigation, Phone, User } from 'lucide-angular';
import { DatabaseService } from '../../core/services/database.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable, switchMap, of } from 'rxjs';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="max-w-5xl mx-auto py-8 px-4">
      <header *ngIf="authService.user$ | async as user" class="mb-10">
        <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white overflow-hidden shadow-xl">
                <img *ngIf="user.photoURL" [src]="user.photoURL" class="w-full h-full object-cover">
                <lucide-icon *ngIf="!user.photoURL" [name]="UserIcon" class="w-8 h-8"></lucide-icon>
            </div>
            <div>
                <h1 class="text-3xl font-black text-slate-900 leading-none mb-2">Hello, {{user.displayName.split(' ')[0]}}!</h1>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{{user.role}} • Profile Verified</p>
            </div>
        </div>
      </header>

      <!-- Today's Schedule -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-black text-slate-900">Assigned Collections</h3>
            <div *ngIf="bookings$ | async as bookings" class="bg-white px-4 py-2 rounded-xl text-xs font-black text-brand-teal border border-slate-50 shadow-sm">
                {{bookings.length}} Tasks Pending
            </div>
        </div>

        <div class="space-y-6">
            <div *ngFor="let booking of bookings$ | async" class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-xl hover:shadow-brand-teal/5 transition-all duration-500">
                <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-brand-mint transition-colors"></div>
                
                <div class="flex flex-col md:flex-row gap-8 relative z-10">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider">{{booking.scheduledSlot}} Slot</span>
                            <span class="text-brand-teal font-black text-[10px] uppercase tracking-widest italic" *ngIf="booking.status === 'In-Transit'">Active</span>
                        </div>
                        <h4 class="text-2xl font-black text-slate-900 mb-2">{{booking.customerName}}</h4>
                        <div class="flex items-start gap-2 text-slate-400 mb-6">
                            <lucide-icon [name]="MapIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                            <p class="text-sm font-bold leading-relaxed">{{booking.address.fullAddress}}</p>
                        </div>
                        <div class="flex items-center gap-4">
                            <a [href]="'tel:' + booking.customerPhone" class="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-xs hover:bg-slate-100 transition-all flex items-center gap-2 decoration-none">
                                <lucide-icon [name]="PhoneIcon" class="w-4 h-4"></lucide-icon> Call Patient
                            </a>
                            <button class="bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-xs hover:bg-slate-100 transition-all flex items-center gap-2">
                                <lucide-icon [name]="NavIcon" class="w-4 h-4"></lucide-icon> Directions
                            </button>
                        </div>
                    </div>
                    
                    <div class="md:w-64 bg-slate-50 rounded-[1.5rem] p-6 flex flex-col justify-between">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tests Required</p>
                            <p class="text-sm font-black text-slate-900 line-clamp-2">
                                <span *ngFor="let t of booking.tests; let last = last">{{t.name}}{{!last ? ', ' : ''}}</span>
                            </p>
                        </div>
                        <button (click)="updateStatus(booking.id, 'Collected')" class="w-full bg-brand-teal text-white py-4 rounded-xl font-black text-sm shadow-lg shadow-brand-teal/10 hover:bg-brand-dark transition-all mt-6">
                            Mark Collected
                        </button>
                    </div>
                </div>
            </div>

            <div *ngIf="!(bookings$ | async)?.length" class="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-100">
                <p class="text-slate-300 font-black uppercase tracking-widest text-sm">No assignments found</p>
            </div>
        </div>
      </section>

      <!-- History Link -->
      <button class="w-full py-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-300 font-black uppercase tracking-[0.3em] hover:text-brand-teal hover:border-brand-teal transition-all text-xs">
          View Past Collections
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class TechnicianDashboardComponent {
  public authService = inject(AuthService);
  private dbService = inject(DatabaseService);

  readonly MapIcon = MapPin;
  readonly ClockIcon = Clock;
  readonly PhoneIcon = Phone;
  readonly NavIcon = Navigation;
  readonly UserIcon = User;

  bookings$: Observable<any[]> = this.authService.user$.pipe(
    switchMap(user => user ? this.dbService.getTechnicianBookings(user.uid) : of([]))
  );

  async updateStatus(id: string, status: string) {
    await this.dbService.updateBookingStatus(id, status);
  }
}
