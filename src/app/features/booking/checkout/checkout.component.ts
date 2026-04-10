import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Calendar, Clock, CreditCard, ChevronRight } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';
import { ActivatedRoute, Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit {
  private dbService = inject(DatabaseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('addressInput') addressInput!: ElementRef;

  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CardIcon = CreditCard;
  readonly NextIcon = ChevronRight;

  selectedTest: any = null;
  address: string = '';
  selectedDate: string = '';
  selectedSlot: string = '';

  dates = [
    { day: 'Mon', date: '12 Apr' },
    { day: 'Tue', date: '13 Apr' },
    { day: 'Wed', date: '14 Apr' },
    { day: 'Thu', date: '15 Apr' },
  ];

  slots = ['06:00 - 07:00 AM', '07:00 - 08:00 AM', '08:00 - 09:00 AM', '09:00 - 10:00 AM', '10:00 - 11:00 AM'];

  ngOnInit() {
    const testId = this.route.snapshot.queryParamMap.get('testId');
    if (testId) {
      // In real app, fetch from db
      this.selectedTest = { id: testId, name: 'Vitamin D (25-Hydroxy)', price: 1200 };
    }
  }

  ngAfterViewInit() {
    this.initAutocomplete();
  }

  initAutocomplete() {
    if (typeof google === 'undefined') return;
    const autocomplete = new google.maps.places.Autocomplete(this.addressInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.address = place.formatted_address;
    });
  }

  async placeOrder() {
    if (!this.address || !this.selectedDate || !this.selectedSlot) {
      alert('Please fill all details');
      return;
    }

    const booking = {
      userId: 'user123',
      customerName: 'Rohit',
      customerPhone: '9876543210',
      tests: [this.selectedTest],
      totalAmount: this.selectedTest.price,
      status: 'Pending' as const,
      address: {
        fullAddress: this.address,
        lat: 28.6139,
        lng: 77.2090
      },
      scheduledDate: this.selectedDate,
      scheduledSlot: this.selectedSlot
    };

    try {
      await this.dbService.createBooking(booking);
      alert('Booking successful!');
      this.router.navigate(['/profile']);
    } catch (e) {
      console.error(e);
    }
  }
}
