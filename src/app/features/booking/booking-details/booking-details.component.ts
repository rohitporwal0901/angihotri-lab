import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Phone, User, CheckCircle2, Clock, Truck, Home } from 'lucide-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { DatabaseService } from '../../../core/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Booking } from '../../../core/models/booking.model';
import { ActiveTracking } from '../../../core/models/tracking.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, GoogleMapsModule],
  templateUrl: './booking-details.component.html',
  styles: []
})
export class BookingDetailsComponent implements OnInit {
  private dbService = inject(DatabaseService);
  private route = inject(ActivatedRoute);

  readonly MapPinIcon = MapPin;
  readonly PhoneIcon = Phone;
  readonly UserIcon = User;
  readonly HomeIcon = Home;

  booking$: Observable<Booking | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (id) return this.dbService.getBookingById(id);
      return of(null);
    })
  );

  tracking$: Observable<ActiveTracking | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (id) return this.dbService.getLiveTracking(id);
      return of(null);
    })
  );

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    scrollwheel: true,
    styles: [
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#7c93a3"}]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#1d3557"}]
        }
    ]
  };

  center: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.2090 };
  zoom = 15;

  ngOnInit() {}

  statuses = [
    { label: 'Confirmed', status: 'Pending', icon: CheckCircle2 },
    { label: 'Assigned', status: 'Assigned', icon: User },
    { label: 'In Transit', status: 'In-Transit', icon: Truck },
    { label: 'Sample Collected', status: 'Collected', icon: Home },
    { label: 'Reports Completed', status: 'Completed', icon: CheckCircle2 }
  ];

  isCompleted(status: string, bookingStatus: string): boolean {
    const order = ['Pending', 'Assigned', 'In-Transit', 'Collected', 'Completed'];
    return order.indexOf(bookingStatus) >= order.indexOf(status);
  }
}
