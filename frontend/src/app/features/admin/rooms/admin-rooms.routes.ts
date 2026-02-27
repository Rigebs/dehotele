import { Routes } from '@angular/router';

export const ADMIN_ROOMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-rooms-page/admin-rooms-page').then((m) => m.AdminRoomsPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/admin-room-form-page/admin-room-form-page').then((m) => m.AdminRoomFormPage),
  },
  {
    path: ':roomId',
    loadComponent: () =>
      import('./pages/admin-room-form-page/admin-room-form-page').then((m) => m.AdminRoomFormPage),
  },
];
