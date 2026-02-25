import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role-guard';
import { AdminLayout } from '../../shared/layouts/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivateChild: [roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-dashboard-page/admin-dashboard-page').then(
            (m) => m.AdminDashboardPage,
          ),
      },
      {
        path: 'hotels',
        loadChildren: () =>
          import('./hotels/admin-hotels.routes').then((m) => m.ADMIN_HOTELS_ROUTES),
      },
      {
        path: 'reservations',
        loadChildren: () =>
          import('./reservations/admin-reservations.routes').then(
            (m) => m.ADMIN_RESERVATIONS_ROUTES,
          ),
      },
    ],
  },
];
