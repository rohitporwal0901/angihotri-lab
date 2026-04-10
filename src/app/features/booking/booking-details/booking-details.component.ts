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
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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

  private map?: L.Map;
  private customerMarker?: L.Marker;
  private technicianMarker?: L.Marker;
  private subscription = new Subscription();

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
    
    this.subscription.add(
      this.booking$.subscribe(booking => {
        if (booking && this.map) {
          const coords: L.LatLngExpression = [booking.address.lat, booking.address.lng];
          this.map.setView(coords, 15);
          this.updateCustomerMarker(booking.address.lat, booking.address.lng);
        }
      })
    );

    this.subscription.add(
      this.tracking$.subscribe(tracking => {
        if (tracking && this.map) {
          this.updateTechnicianMarker(tracking.lat, tracking.lng);
        }
      })
    );
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  private updateCustomerMarker(lat: number, lng: number): void {
    const icon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/32/1476/1476140.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    if (this.customerMarker) {
      this.customerMarker.setLatLng([lat, lng]);
    } else {
      this.customerMarker = L.marker([lat, lng], { icon }).addTo(this.map!);
    }
  }

  private updateTechnicianMarker(lat: number, lng: number): void {
    const icon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/32/7144/7144889.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    if (this.technicianMarker) {
      this.technicianMarker.setLatLng([lat, lng]);
    } else {
      this.technicianMarker = L.marker([lat, lng], { icon }).addTo(this.map!);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

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
