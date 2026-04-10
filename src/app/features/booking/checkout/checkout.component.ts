import { Component, OnInit, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MapPin, Calendar, Clock, CreditCard, ChevronRight } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';
import { AuthService } from '../../../core/services/auth.service';
import { LabTest } from '../../../core/models/test.model';
import { AppUser } from '../../../core/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit {
  private dbService = inject(DatabaseService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('addressInput') addressInput!: ElementRef;

  readonly MapPinIcon = MapPin;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly CardIcon = CreditCard;
  readonly NextIcon = ChevronRight;

  selectedTest: LabTest | null = null;
  address: string = '';
  selectedDate: string = '';
  selectedSlot: string = '';
  user: AppUser | null = null;

  dates: { day: string; date: string; full: Date }[] = [];
  slots = ['06:00 - 07:00 AM', '07:00 - 08:00 AM', '08:00 - 09:00 AM', '09:00 - 10:00 AM', '10:00 - 11:00 AM'];

  ngOnInit() {
    this.generateDates();
    this.authService.user$.subscribe(u => this.user = u);
    
    const testId = this.route.snapshot.queryParamMap.get('testId');
    if (testId) {
      this.dbService.getTests().subscribe(tests => {
        this.selectedTest = tests.find(t => t.id === testId) || null;
      });
    }
  }

  generateDates() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        this.dates.push({
            day: days[d.getDay()],
            date: d.getDate() + ' ' + months[d.getMonth()],
            full: d
        });
    }
    this.selectedDate = this.dates[0].date;
  }

  initAutocomplete() {
    // Google Places Autocomplete removed as it requires a paid API key.
    // Standard text input will be used instead.
    console.log('Autocomplete disabled - please enter address manually');
  }

  async placeOrder() {
    if (!this.address || !this.selectedDate || !this.selectedSlot || !this.selectedTest) {
      alert('Please fill all details');
      return;
    }

    if (!this.user) {
        alert('Please login first');
        return;
    }

    const booking: any = {
      userId: this.user.uid,
      customerName: this.user.displayName,
      customerPhone: this.user.phoneNumber || '',
      tests: [this.selectedTest],
      totalAmount: this.selectedTest.price,
      status: 'Pending',
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
      this.router.navigate(['/profile']);
    } catch (e) {
      console.error(e);
    }
  }
}
