import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const RESERVATIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/reservations-page/reservations-page').then((m) => m.ReservationsPage),
  },
  {
    path: 'create/:hotelId/:roomId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/create-reservation-page/create-reservation-page').then(
        (m) => m.CreateReservationPage,
      ),
  },
];
