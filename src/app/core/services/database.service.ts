import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, setDoc, updateDoc, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Database, ref, set, onValue, update } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { Booking } from '../models/booking.model';
import { LabTest } from '../models/test.model';
import { ActiveTracking } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore = inject(Firestore);
  private rtdb = inject(Database);

  // Tests Catalog
  getTests(): Observable<LabTest[]> {
    const testsRef = collection(this.firestore, 'Tests_Catalog');
    return collectionData(testsRef, { idField: 'id' }) as Observable<LabTest[]>;
  }

  // Bookings
  createBooking(booking: Partial<Booking>): Promise<void> {
    const bookingId = doc(collection(this.firestore, 'Bookings') as any).id;
    const finalBooking = {
      ...booking,
      id: bookingId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(this.firestore, 'Bookings', bookingId) as any, finalBooking);
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
  }

  getBookingById(id: string): Observable<Booking> {
    const bookingRef = doc(this.firestore, 'Bookings', id);
    return docData(bookingRef as any) as Observable<Booking>;
  }

  // Realtime Tracking
  updateTechnicianLocation(tracking: ActiveTracking): Promise<void> {
    const trackingRef = ref(this.rtdb, `active_tracking/${tracking.bookingId}`);
    return set(trackingRef, tracking);
  }

  getLiveTracking(bookingId: string): Observable<ActiveTracking | null> {
    return new Observable(subscriber => {
      const trackingRef = ref(this.rtdb, `active_tracking/${bookingId}`);
      const unsubscribe = onValue(trackingRef, (snapshot) => {
        subscriber.next(snapshot.val());
      });
      return () => unsubscribe();
    });
  }
}
