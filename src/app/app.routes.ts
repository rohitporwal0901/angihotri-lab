import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'tests',
    loadComponent: () => import('./features/tests/test-list/test-list.component').then(m => m.TestListComponent)
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./features/booking/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'technician',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Technician' },
    loadComponent: () => import('./features/technician/technician-dashboard.component').then(m => m.TechnicianDashboardComponent)
  },
  {
    path: 'booking/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/booking/booking-details/booking-details.component').then(m => m.BookingDetailsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent)
  }
];
