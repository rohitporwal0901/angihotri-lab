import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRoles = route.data['roles'] as UserRole[];

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
