import { Routes } from '@angular/router';

export const HOTELS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/hotels-page/hotels-page').then((m) => m.HotelsPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/hotel-details-page/hotel-details-page').then((m) => m.HotelDetailsPage),
  },
];
