import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, MapPin, ChevronRight, ClipboardList } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';
import { Observable, of } from 'rxjs';
import { Booking } from '../../../core/models/booking.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  private dbService = inject(DatabaseService);

  readonly UserIcon = User;
  readonly MapPinIcon = MapPin;
  readonly NextIcon = ChevronRight;
  readonly ListIcon = ClipboardList;

  bookings$: Observable<Booking[]> = this.dbService.getUserBookings('user123');

  ngOnInit() {}
}
