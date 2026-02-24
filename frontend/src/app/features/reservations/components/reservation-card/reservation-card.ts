import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Button } from '../../../../shared/ui/button/button';
import { ReservationResponse } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-card',
  imports: [Button],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationCard {
  readonly reservation = input.required<ReservationResponse>();
  readonly cancel = output<number>();

  onCancel() {
    this.cancel.emit(this.reservation().id);
  }
}
