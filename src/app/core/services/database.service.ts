import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp, 
  getDoc,
  onSnapshot,
  increment
} from '@angular/fire/firestore';
import { Database, ref, set, onValue, update } from '@angular/fire/database';
import { Observable, from, map } from 'rxjs';
import { Booking } from '../models/booking.model';
import { LabTest } from '../models/test.model';
import { AppUser } from '../models/user.model';
import { ActiveTracking } from '../models/tracking.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore = inject(Firestore);
  private rtdb = inject(Database);

  // Helper used in physio-app to avoid collectionData issues
  private collectionToObservable<T>(q: any, idField: string = 'id'): Observable<T[]> {
    return new Observable<T[]>(subscriber => {
      return onSnapshot(q, (snapshot: any) => {
        const data = snapshot.docs.map((d: any) => ({
          [idField]: d.id,
          ...d.data()
        })) as T[];
        subscriber.next(data);
      }, (error: any) => subscriber.error(error));
    });
  }

  private docToObservable<T>(docRef: any, idField: string = 'id'): Observable<T> {
    return new Observable<T>(subscriber => {
      return onSnapshot(docRef, (snapshot: any) => {
        if (snapshot.exists()) {
          subscriber.next({ [idField]: snapshot.id, ...snapshot.data() } as T);
        } else {
          subscriber.next(null as any);
        }
      }, (error: any) => subscriber.error(error));
    });
  }

  // Tests Catalog
  getTests(): Observable<LabTest[]> {
    const testsRef = collection(this.firestore, 'Tests_Catalog');
    const q = query(testsRef);
    return this.collectionToObservable<LabTest>(q);
  }

  getCategories(): Observable<any[]> {
    const catRef = collection(this.firestore, 'Categories');
    return this.collectionToObservable<any>(catRef);
  }

  addTest(test: Partial<LabTest>): Promise<void> {
    const testsRef = collection(this.firestore, 'Tests_Catalog');
    const testId = doc(testsRef).id;
    return setDoc(doc(this.firestore, 'Tests_Catalog', testId), { ...test, id: testId });
  }

  // Bookings
  createBooking(booking: Partial<Booking>): Promise<void> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const bookingId = doc(bookingsRef).id;
    const finalBooking = {
      ...booking,
      id: bookingId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return setDoc(doc(this.firestore, 'Bookings', bookingId), finalBooking);
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(bookingsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return this.collectionToObservable<Booking>(q);
  }

  getBookingById(id: string): Observable<Booking> {
    const bookingRef = doc(this.firestore, 'Bookings', id);
    return this.docToObservable<Booking>(bookingRef);
  }

  // Users & Technicians
  getTechnicians(): Observable<AppUser[]> {
    const usersRef = collection(this.firestore, 'Users');
    const q = query(usersRef, where('role', '==', 'Technician'));
    return this.collectionToObservable<AppUser>(q, 'uid');
  }

  // Dashboard Stats (Real-time)
  getAdminStats(): Observable<any> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    return this.collectionToObservable<any>(bookingsRef).pipe(
      map(bookings => ({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === 'Pending').length,
        completedBookings: bookings.filter((b: any) => b.status === 'Completed').length,
      }))
    );
  }

  // Bookings with Filter
  getAllBookings(): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    return this.collectionToObservable<Booking>(q);
  }

  getTechnicianBookings(techId: string): Observable<Booking[]> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(bookingsRef, where('technicianId', '==', techId), orderBy('createdAt', 'desc'));
    return this.collectionToObservable<Booking>(q);
  }

  updateBooking(id: string, data: Partial<Booking>): Promise<void> {
    const bookingRef = doc(this.firestore, 'Bookings', id);
    return updateDoc(bookingRef, { ...data, updatedAt: Timestamp.now() });
  }

  updateBookingStatus(id: string, status: string): Promise<void> {
    return this.updateBooking(id, { status } as any);
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
