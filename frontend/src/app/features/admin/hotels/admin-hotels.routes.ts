import { Routes } from '@angular/router';

export const ADMIN_HOTELS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-hotels-page/admin-hotels-page').then((m) => m.AdminHotelsPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/admin-hotel-form-page/admin-hotel-form-page').then(
        (m) => m.AdminHotelFormPage,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/admin-hotel-form-page/admin-hotel-form-page').then(
        (m) => m.AdminHotelFormPage,
      ),
  },
];
