import { Routes } from '@angular/router';

export const ADMIN_RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-reservations-page/admin-reservations-page').then(
        (m) => m.AdminReservationsPage,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/admin-reservation-form-page/admin-reservation-form-page').then(
        (m) => m.AdminReservationFormPage,
      ),
  },
];
