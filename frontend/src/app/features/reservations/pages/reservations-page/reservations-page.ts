import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation-service';
import { ToastService } from '../../../../core/services/toast-service';
import { ReservationResponse } from '../../../../core/models/reservation.models';
import { ReservationCard } from '../../components/reservation-card/reservation-card';

@Component({
  selector: 'app-reservations-page',
  imports: [ReservationCard],
  templateUrl: './reservations-page.html',
  styleUrl: './reservations-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsPage {
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  readonly reservations = signal<readonly ReservationResponse[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.reservationService.getMyReservations().subscribe((data) => {
      this.reservations.set(data);
    });
  }

  cancel(id: number) {
    this.reservationService.cancelReservation(id).subscribe(() => {
      this.toast.show({
        type: 'success',
        message: 'Reservation cancelled',
      });
      this.load();
    });
  }
}
