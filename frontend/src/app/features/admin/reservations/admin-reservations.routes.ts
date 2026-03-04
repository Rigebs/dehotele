import { Routes } from '@angular/router';

export const ADMIN_RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-reservations-page/admin-reservations-page').then(
        (m) => m.AdminReservationsPage,
      ),
  },
];
