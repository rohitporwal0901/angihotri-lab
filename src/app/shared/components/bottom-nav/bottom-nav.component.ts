import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Search, ClipboardList, User } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  authService = inject(AuthService);
  
  readonly HomeIcon = Home;
  readonly SearchIcon = Search;
  readonly BookingsIcon = ClipboardList;
  readonly ProfileIcon = User;

  navItems = [
    { label: 'Home', route: '/', icon: this.HomeIcon },
    { label: 'Tests', route: '/tests', icon: this.SearchIcon },
    { label: 'Bookings', route: '/profile', icon: this.BookingsIcon },
    { label: 'Profile', route: '/profile', icon: this.ProfileIcon },
  ];
}
