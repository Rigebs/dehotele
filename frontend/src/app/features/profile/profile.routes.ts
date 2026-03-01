import { Routes } from '@angular/router';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/user-profile-page/user-profile-page').then((m) => m.UserProfilePage),
  },
];
