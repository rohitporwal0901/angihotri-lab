import { Injectable, inject } from '@angular/core';
import { Geolocation, WatchPositionCallback } from '@capacitor/geolocation';
import { DatabaseService } from './database.service';
import { BookingStatus } from '../models/booking.model';
import { ActiveTracking } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private dbService = inject(DatabaseService);
  private watchId: string | null = null;

  async startTracking(bookingId: string, technicianId: string) {
    if (this.watchId) return;

    this.watchId = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    }, (position, err) => {
      if (err) {
        console.error('Tracking error:', err);
        return;
      }

      if (position) {
        const tracking: ActiveTracking = {
          bookingId,
          technicianId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          bearing: position.coords.heading || 0,
          lastUpdated: Date.now()
        };
        this.dbService.updateTechnicianLocation(tracking);
      }
    });
  }

  async stopTracking() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }
}
