import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { roleGuard } from '../../core/guards/role-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./pages/admin-dashboard.page').then((m) => m.AdminDashboardPage),
  },
  {
    path: 'hotels',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () => import('./pages/manage-hotels.page').then((m) => m.ManageHotelsPage),
  },
  {
    path: 'reservations',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadComponent: () =>
      import('./pages/manage-reservations.page').then((m) => m.ManageReservationsPage),
  },
];
