import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as Array<string>;

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (user && expectedRoles.includes(user.role)) {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
