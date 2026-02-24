import { Routes } from '@angular/router';
import { AppLayout } from './shared/layouts/app-layout/app-layout';

export const routes: Routes = [
  // Admin SIN AppLayout
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Rutas públicas con AppLayout
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/hotels/hotel.routes').then((m) => m.HOTELS_ROUTES),
      },
      {
        path: 'reservations',
        loadChildren: () =>
          import('./features/reservations/reservations.routes').then((m) => m.RESERVATIONS_ROUTES),
      },
    ],
  },

  // Auth (sin AppLayout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },

  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
