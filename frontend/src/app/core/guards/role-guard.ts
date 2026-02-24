import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const getRoles = (r: ActivatedRouteSnapshot): string[] | undefined => {
    if (r.data?.['roles']) return r.data['roles'];
    if (r.parent) return getRoles(r.parent);
    return undefined;
  };

  const allowedRoles = getRoles(route);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const rawRole = authService.currentUser()?.role || '';
  const userRole = rawRole.replace(/^ROLE_/, '');

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
