import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LayoutDashboard, Microscope, Users, Plus, ArrowUpRight, Clock, CheckCircle } from 'lucide-angular';
import { DatabaseService } from '../../core/services/database.service';
import { Observable } from 'rxjs';
import { AddTechnicianComponent } from './add-technician/add-technician.component';
import { AddTestComponent } from './add-test/add-test.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AddTechnicianComponent, AddTestComponent],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4">
      <app-add-technician *ngIf="showAddTech" (close)="showAddTech = false" (success)="showAddTech = false"></app-add-technician>
      <app-add-test *ngIf="showAddTest" (close)="showAddTest = false" (success)="showAddTest = false"></app-add-test>
      <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 class="text-3xl font-black text-slate-900 mb-2 leading-none">Admin Control</h1>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Management Hub & Analytics</p>
        </div>
        <div class="flex items-center gap-3">
            <button (click)="showAddTech = true" class="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-sm border border-slate-100 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                <lucide-icon [name]="PlusIcon" class="w-4 h-4"></lucide-icon> New Technician
            </button>
            <button (click)="showAddTest = true" class="bg-brand-teal text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-brand-teal/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                <lucide-icon [name]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Test
            </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div *ngIf="stats$ | async as stats" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div class="absolute top-0 right-0 w-24 h-24 bg-brand-teal/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
            <p class="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-4">Total Bookings</p>
            <div class="flex items-baseline gap-2">
                <h4 class="text-4xl font-black text-slate-900">{{stats.totalBookings}}</h4>
                <span class="text-emerald-500 text-xs font-black flex items-center gap-1">+{{stats.pendingBookings}} pending <lucide-icon [name]="TrendIcon" class="w-3 h-3"></lucide-icon></span>
            </div>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
            <p class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Active Tests</p>
            <h4 class="text-4xl font-black text-slate-900">{{(tests$ | async)?.length || 0}}</h4>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
            <div class="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform"></div>
            <p class="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-4">Technicians</p>
            <h4 class="text-4xl font-black text-slate-900">{{(technicians$ | async)?.length || 0 | number:'2.0-0'}}</h4>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Recent Bookings Table Style -->
        <div class="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-xl font-black text-slate-900">Recent Appointments</h3>
                <button class="text-brand-teal font-black text-xs uppercase tracking-widest hover:underline">View All</button>
            </div>
            
            <div class="space-y-4">
                <div *ngFor="let booking of bookings$ | async" class="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-white hover:ring-2 hover:ring-brand-teal group transition-all">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-white rounded-[1rem] flex items-center justify-center shadow-sm group-hover:bg-brand-mint">
                            <lucide-icon [name]="ClockIcon" class="w-6 h-6 text-slate-300 group-hover:text-brand-teal"></lucide-icon>
                        </div>
                        <div>
                            <p class="font-black text-slate-900">{{booking.customerName || 'Patient'}}</p>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{{booking.tests[0].name}} • {{booking.scheduledDate}}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <select (change)="assignTechnician(booking.id, $event)" 
                                class="bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:border-brand-teal transition-all outline-none">
                            <option value="">Assign Tech</option>
                            <option *ngFor="let tech of technicians$ | async" [value]="tech.uid" [selected]="booking.technicianId === tech.uid">
                                {{tech.displayName}}
                            </option>
                        </select>
                        <span [class]="'text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ' + 
                              (booking.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 
                               booking.status === 'Assigned' ? 'bg-blue-50 text-blue-600' :
                               'bg-emerald-50 text-emerald-600')">
                            {{booking.status}}
                        </span>
                    </div>
                </div>
                <div *ngIf="!(bookings$ | async)?.length" class="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-xs">
                    No bookings found
                </div>
            </div>
        </div>

        <!-- Sidebar Section -->
        <div class="space-y-8">
            <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                <div class="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 rounded-full blur-3xl"></div>
                <h3 class="text-lg font-black mb-6">Quick Actions</h3>
                <div class="space-y-3 relative z-10">
                    <button class="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between group transition-all">
                        <span class="text-sm font-bold">Update Test Prices</span>
                        <lucide-icon [name]="TrendIcon" class="w-4 h-4 text-brand-teal"></lucide-icon>
                    </button>
                    <button class="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between group transition-all">
                        <span class="text-sm font-bold">Manage Categories</span>
                        <lucide-icon [name]="MicroscopeIcon" class="w-4 h-4 text-blue-400"></lucide-icon>
                    </button>
                    <button class="w-full bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between group transition-all">
                        <span class="text-sm font-bold">Lab Reports</span>
                        <lucide-icon [name]="CheckIcon" class="w-4 h-4 text-emerald-400"></lucide-icon>
                    </button>
                </div>
            </div>

            <div class="bg-brand-mint rounded-[2.5rem] p-8 border border-brand-teal/10">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 bg-brand-teal text-white rounded-xl flex items-center justify-center">
                        <lucide-icon [name]="UsersIcon" class="w-5 h-5"></lucide-icon>
                    </div>
                    <h3 class="text-lg font-black text-slate-900">Online Staff</h3>
                </div>
                <!-- Staff Dots -->
                <div class="flex -space-x-3">
                    <div *ngFor="let tech of technicians$ | async" class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 overflow-hidden">
                        <img *ngIf="tech.photoURL" [src]="tech.photoURL" class="w-full h-full object-cover">
                        <span *ngIf="!tech.photoURL">{{tech.displayName[0]}}</span>
                    </div>
                    <div *ngIf="!(technicians$ | async)?.length" class="text-xs font-bold text-slate-400 italic">No technicians online</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AdminDashboardComponent {
  private dbService = inject(DatabaseService);

  public showAddTech = false;
  public showAddTest = false;

  readonly DashIcon = LayoutDashboard;
  readonly MicroscopeIcon = Microscope;
  readonly UsersIcon = Users;
  readonly PlusIcon = Plus;
  readonly TrendIcon = ArrowUpRight;
  readonly ClockIcon = Clock;
  readonly CheckIcon = CheckCircle;

  stats$ = this.dbService.getAdminStats();
  bookings$ = this.dbService.getAllBookings();
  tests$ = this.dbService.getTests();
  technicians$ = this.dbService.getTechnicians();

  async assignTechnician(bookingId: string, event: Event) {
    const techId = (event.target as HTMLSelectElement).value;
    if (techId) {
        await this.dbService.updateBooking(bookingId, { technicianId: techId, status: 'Assigned' });
    }
  }
}
