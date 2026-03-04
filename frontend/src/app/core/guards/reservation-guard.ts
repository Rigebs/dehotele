import { CanDeactivateFn } from '@angular/router';
import { CreateReservationPage } from '../../features/reservations/pages/create-reservation-page/create-reservation-page';

export const pendingReservationGuard: CanDeactivateFn<CreateReservationPage> = (component) => {
  return component.canExit ? component.canExit() : true;
};
