import { Routes } from '@angular/router';

export const HOTELS_ROUTES: Routes = [
  // Lista de hoteles
  {
    path: '',
    loadComponent: () =>
      import('./pages/hotel-list-page/hotel-list-page').then((m) => m.HotelListPage),
    pathMatch: 'full', // aquí sí se usa full
  },

  // Detalles de hotel (dinámica)
  {
    path: 'hotels/:id',
    loadComponent: () =>
      import('./pages/hotel-details-page/hotel-details-page').then((m) => m.HotelDetailsPage),
  },
];
