import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const RESERVATIONS_ROUTES: Routes = [
  {
    path: 'my',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/my-reservations-page/my-reservations-page').then((m) => m.MyReservationsPage),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/create-reservation-page/create-reservation-page').then(
        (m) => m.CreateReservationPage,
      ),
  },
];
