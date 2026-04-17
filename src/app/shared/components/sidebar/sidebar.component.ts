import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
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

  get userRole() { return this.authService.currentUser?.role; }
  get userName() { return this.authService.currentUser?.displayName; }

  menuItems: any[] = [];

  ngOnInit() {
    this.setupMenu();
  }

  setupMenu() {
    if (this.userRole === 'admin') {
      this.menuItems = [
        { icon: 'layout-dashboard', label: 'Overview', route: '/admin' },
        { icon: 'users', label: 'Staff Management', route: '/admin/staff' },
        { icon: 'flask-conical', label: 'Test Inventory', route: '/admin/tests' },
        { icon: 'activity', label: 'Analytics', route: '/admin/analytics' },
      ];
    } else if (this.userRole === 'technician') {
      this.menuItems = [
        { icon: 'map-pin', label: 'Active Pickups', route: '/technician' },
        { icon: 'clipboard-list', label: 'My Deliveries', route: '/technician/deliveries' },
        { icon: 'user', label: 'My Status', route: '/technician/profile' },
      ];
    } else {
      this.menuItems = [
        { icon: 'user', label: 'My health', route: '/profile' },
        { icon: 'file-text', label: 'Reports', route: '/profile/reports' },
      ];
    }
  }

  logout() {
    this.authService.logout();
  }
}
