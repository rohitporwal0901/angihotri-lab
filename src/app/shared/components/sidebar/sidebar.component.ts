import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Search, ClipboardList, User, MapPin, LogIn, LayoutDashboard, Microscope, Users, Truck, LogOut } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  authService = inject(AuthService);
  readonly LogoutIcon = LogOut;
  
  menuItems$ = this.authService.user$.pipe(
    map(user => {
      const role = user?.role || 'Guest';
      
      switch(role) {
        case 'Admin':
          return [
            { label: 'Overview', route: '/admin', icon: LayoutDashboard },
            { label: 'All Bookings', route: '/admin', icon: ClipboardList },
            { label: 'Manage Tests', route: '/admin', icon: Microscope },
            { label: 'Staff/Techs', route: '/admin', icon: Users },
            { label: 'My Profile', route: '/profile', icon: User },
          ];
        case 'Technician':
          return [
            { label: 'Collections', route: '/technician', icon: Truck },
            { label: 'Assigned', route: '/technician', icon: MapPin },
            { label: 'My Account', route: '/profile', icon: User },
          ];
        default:
          return [
            { label: 'Home', route: '/', icon: Home },
            { label: 'Search Tests', route: '/tests', icon: Search },
            { label: 'My Bookings', route: '/profile', icon: ClipboardList },
            { label: 'Profile', route: '/profile', icon: User },
          ];
      }
    })
  );
}
