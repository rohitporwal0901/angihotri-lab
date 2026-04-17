import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, LucideAngularModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
    stats = [
        { label: 'Total Patients', value: '1,240', icon: 'users', color: 'bg-blue-100 text-blue-600' },
        { label: 'Pending Tests', value: '45', icon: 'flask-conical', color: 'bg-amber-100 text-amber-600' },
        { label: 'Revenue', value: '₹4.2L', icon: 'indian-rupee', color: 'bg-emerald-100 text-emerald-600' },
        { label: 'Technicians', value: '8 Active', icon: 'map-pin', color: 'bg-indigo-100 text-indigo-600' },
    ];
}
