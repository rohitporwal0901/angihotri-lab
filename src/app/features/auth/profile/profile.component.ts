import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, User, List, ChevronRight } from 'lucide-angular';
import { DatabaseService } from '../../../core/services/database.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  private dbService = inject(DatabaseService);
  public authService = inject(AuthService);
  
  readonly UserIcon = User;
  readonly ListIcon = List;
  readonly NextIcon = ChevronRight;

  bookings$: Observable<any[]> = this.authService.user$.pipe(
    switchMap(user => user ? this.dbService.getUserBookings(user.uid) : of([]))
  );

  ngOnInit() {
  }
}
