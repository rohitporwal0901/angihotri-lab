import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Search, ClipboardList, User, MapPin, LogIn } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  authService = inject(AuthService);
  
  readonly HomeIcon = Home;
  readonly SearchIcon = Search;
  readonly BookingsIcon = ClipboardList;
  readonly ProfileIcon = User;
  readonly TrackingIcon = MapPin;
  readonly LoginIcon = LogIn;

  menuItems = [
    { label: 'Home', route: '/', icon: this.HomeIcon },
    { label: 'Search Tests', route: '/tests', icon: this.SearchIcon },
    { label: 'My Bookings', route: '/profile', icon: this.BookingsIcon },
    { label: 'Profile', route: '/profile', icon: this.ProfileIcon },
  ];
}
