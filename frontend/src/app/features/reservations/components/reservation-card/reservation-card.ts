import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Card } from '../../../../shared/ui/card/card';
import { Button } from '../../../../shared/ui/button/button';
import { ReservationResponse } from '../../../../core/models/reservation.models';

@Component({
  selector: 'app-reservation-card',
  imports: [Card, Button],
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
