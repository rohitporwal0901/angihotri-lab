import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Search, ClipboardList, User, LayoutDashboard, Truck } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  authService = inject(AuthService);
  
  navItems$ = this.authService.user$.pipe(
    map(user => {
      const role = user?.role || 'Guest';
      
      switch(role) {
        case 'Admin':
          return [
            { label: 'Stats', route: '/admin', icon: LayoutDashboard },
            { label: 'Booking', route: '/admin', icon: ClipboardList },
            { label: 'Account', route: '/profile', icon: User },
          ];
        case 'Technician':
          return [
            { label: 'Tasks', route: '/technician', icon: Truck },
            { label: 'My Acc', route: '/profile', icon: User },
          ];
        default:
          return [
            { label: 'Home', route: '/', icon: Home },
            { label: 'Tests', route: '/tests', icon: Search },
            { label: 'Acc', route: '/profile', icon: User },
          ];
      }
    })
  );
}
