import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'] as 'ADMIN' | 'USER';

  if (!authService.currentUser() || authService.currentUser()?.role !== requiredRole) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
