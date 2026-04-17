import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, LucideAngularModule],
  templateUrl: './technician-dashboard.component.html',
  styleUrl: './technician-dashboard.component.css'
})
export class TechnicianDashboardComponent {
    activePickups = [
        { patient: 'Rohit Porwal', time: '10:30 AM', location: 'Indrapuri, Bhopal', status: 'Pending' },
        { patient: 'Amit Sharma', time: '11:15 AM', location: 'Arera Colony', status: 'On the way' },
        { patient: 'Priya Singh', time: '12:00 PM', location: 'MP Nagar', status: 'Pending' },
    ];
}
