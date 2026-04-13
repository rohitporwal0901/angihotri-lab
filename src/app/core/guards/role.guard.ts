import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const roles = route.data['roles'] || route.data['role'];
  const expectedRoles = Array.isArray(roles) ? roles : roles ? [roles] : [];

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user && expectedRoles.includes(user.role)) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    })
  );
};
